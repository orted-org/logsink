package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func initHandler(app *App, r *chi.Mux) {

	r.Route("/api", func(r chi.Router) {
		// auth
		r.Post("/auth", app.handleLogin)
		r.Delete("/auth", app.handleCheckAllowance(http.HandlerFunc(app.handleLogout)))

		// service management
		r.Get("/service", app.handleCheckAllowance(http.HandlerFunc(app.handleGetService)))
		r.Post("/service", app.handleCheckAllowance(http.HandlerFunc(app.handleAddService)))
		r.Put("/service/{id}", app.handleCheckAllowance(http.HandlerFunc(app.handleUpdateService)))
		r.Delete("/service/{id}", app.handleCheckAllowance(http.HandlerFunc(app.handleDeleteService)))
	})

	// sink
	r.Get("/sink", app.handleSink)

	// WebUI
	r.Get("/", func(rw http.ResponseWriter, r *http.Request) {
		rw.Header().Set("Content-Type", "text/html; charset=utf-8")
		http.ServeFile(rw, r, "./build/index.html")
	})
	r.Handle("/static/*", http.FileServer(http.Dir("./build")))
}
