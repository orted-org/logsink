package main

import (
	"context"
	"net/http"

	authservice "github.com/orted-org/logsink/internal/auth_service"
)

func (app *App) handleLogin(rw http.ResponseWriter, r *http.Request) {
	token, _ := getCookie(r, "token")
	session, err := app.userAuthService.IfLogin(token)
	if err != nil {
		// not logged in
		var incBody map[string]string
		err := getBody(r, &incBody)

		if err != nil {
			sendErrorResponse(rw, http.StatusBadRequest, nil, err.Error())
			return
		}

		if incBody["username"] == "" || incBody["password"] == "" {
			sendErrorResponse(rw, http.StatusBadRequest, nil, "username/password missing")
			return
		}

		session, err = app.userAuthService.PerformLogin(r.Context(), incBody["username"], incBody["password"])
		if err != nil {
			if err == authservice.ErrUnauthorized {
				sendErrorResponse(rw, http.StatusUnauthorized, nil, err.Error())
			} else {
				sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
			}
			return

		}

		//set the cookie
		setCookie(rw, session.Expires, "token", session.ID)

		sendResponse(rw, http.StatusOK, session, "logged in successfully")
		return
	}
	sendResponse(rw, http.StatusOK, session, "already logged in")
}

func (app *App) handleLogout(rw http.ResponseWriter, r *http.Request) {

	session, ok := r.Context().Value("session").(authservice.Session)
	if !ok {
		sendErrorResponse(rw, http.StatusInternalServerError, nil, "internal server error")
		return
	}

	app.userAuthService.PerformLogout(session.ID)

	http.SetCookie(rw, &http.Cookie{
		Name:     "token",
		MaxAge:   -1,
		HttpOnly: true,
	})

	sendResponse(rw, http.StatusOK, nil, "successfully logged out")
}

//CheckAllowance MiddleWare
func (app *App) handleCheckAllowance(next http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		sessionId, err := getCookie(r, "token")
		if err != nil {
			//No cookie found
			sendErrorResponse(rw, http.StatusUnauthorized, nil, "unauthorized")
			return
		}
		session, err := app.userAuthService.IfLogin(sessionId)

		if err != nil {
			if err == authservice.ErrUnauthorized {
				sendErrorResponse(rw, http.StatusUnauthorized, nil, err.Error())
			} else {
				sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
			}
			return
		}

		//putting sessionData in request context
		newCtx := context.WithValue(r.Context(), "session", session)
		next.ServeHTTP(rw, r.WithContext(newCtx))
	})
}
