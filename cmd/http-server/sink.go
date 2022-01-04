package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (app *App) handleSink(rw http.ResponseWriter, r *http.Request) {
	// upgrade to ws conn
	id := r.Header.Get("X-API-KEY")
	secret := r.Header.Get("X-API-SECRET")
	if id == "" || secret == "" {
		sendErrorResponse(rw, http.StatusBadRequest, nil, "id/key or secret missing")
		return
	}

	service, err := app.serviceAuthService.AuthenticateService(r.Context(), id, secret)
	if err != nil {
		sendErrorResponse(rw, http.StatusUnauthorized, nil, err.Error())
		return
	}
	serviceName := service.ID.Hex()
	// service is authenticated
	ws, err := upgrader.Upgrade(rw, r, nil)
	if err != nil {
		sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
		return
	}
	defer ws.Close()

	// upgrade is successful

	// registering the service
	app.logger.Println("registering service", serviceName, service.Name)
	app.logManager.RegisterService(service.ID.Hex())

	// reading message in blocking fashion
	ReadAndReact(app, ws, serviceName)

	// un-registering the service
	app.logger.Println("un-registering service", serviceName, service.Name)
	app.logManager.UnregisterService(serviceName)
}

func ReadAndReact(app *App, ws *websocket.Conn, serviceName string) {
	for {
		if _, p, err := ws.ReadMessage(); err != nil {
			// read error happened, closing connection
			return
		} else {
			var log map[string]interface{}
			json.Unmarshal(p, &log)
			app.logManager.PutLog(log, serviceName)
		}
	}
}
