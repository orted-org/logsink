package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	db "github.com/orted-org/logsink/db/dao"
	"go.mongodb.org/mongo-driver/mongo"
)

func (app *App) handleAddService(rw http.ResponseWriter, r *http.Request) {
	var arg map[string]string
	err := getBody(r, &arg)
	if err != nil {
		sendErrorResponse(rw, http.StatusBadRequest, nil, err.Error())
		return
	}

	id, secret, err := app.serviceAuthService.CreateNewService(r.Context(), arg["name"], arg["description"])
	if err != nil {
		sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
		return
	}

	arg["id"] = id
	arg["secret"] = secret
	sendResponse(rw, http.StatusCreated, arg, "service created")
}

func (app *App) handleGetService(rw http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		// send all the services
		services, err := app.store.GetServices(r.Context())
		if err != nil {
			sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
			return
		}
		if services == nil {
			services = make([]db.Service, 0)
		}
		sendResponse(rw, http.StatusCreated, services, "")
		return
	}

	// send only of the id
	service, err := app.store.GetServiceByID(r.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			sendErrorResponse(rw, http.StatusNotFound, nil, err.Error())
		} else {
			sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
		}
		return
	}
	sendResponse(rw, http.StatusCreated, service, "")
}

func (app *App) handleDeleteService(rw http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		sendErrorResponse(rw, http.StatusBadRequest, nil, "id missing")
		return
	}

	err := app.store.DeleteServiceByID(r.Context(), id)
	if err != nil {
		sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
		return
	}

	sendResponse(rw, http.StatusOK, nil, "service deleted")
}

func (app *App) handleUpdateService(rw http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	if id == "" {
		sendErrorResponse(rw, http.StatusBadRequest, nil, "id missing")
		return
	}

	var arg db.UpdateServiceByIDParams
	err := getBody(r, &arg)
	if err != nil {
		sendErrorResponse(rw, http.StatusBadRequest, nil, err.Error())
		return
	}

	n, err := app.store.UpdateServiceByID(r.Context(), id, arg)
	if err != nil {
		sendErrorResponse(rw, http.StatusInternalServerError, nil, err.Error())
		return
	}
	if n == 0 {
		sendErrorResponse(rw, http.StatusNotFound, nil, "service not found")
		return
	}

	sendResponse(rw, http.StatusOK, arg, "service updated")
}
