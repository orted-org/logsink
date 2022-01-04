package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func initHandler(app *App, r *chi.Mux) {

	// auth
	r.Post("/auth", app.handleLogin)
	r.Delete("/auth", app.handleCheckAllowance(http.HandlerFunc(app.handleLogout)))

	// service management
	r.Get("/service", app.handleCheckAllowance(http.HandlerFunc(app.handleGetService)))
	r.Post("/service", app.handleCheckAllowance(http.HandlerFunc(app.handleAddService)))
	r.Put("/service/{id}", app.handleCheckAllowance(http.HandlerFunc(app.handleUpdateService)))
	r.Delete("/service/{id}", app.handleCheckAllowance(http.HandlerFunc(app.handleDeleteService)))

	// sink
	r.Get("/sink", app.handleSink)

}
