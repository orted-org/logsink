package main

import (
	"log"
	"net/http"
	"os"

	db "github.com/orted-org/logsink/db/dao"
	authservice "github.com/orted-org/logsink/internal/auth_service"
	logbroadcaster "github.com/orted-org/logsink/internal/log_broadcaster"
	logmanager "github.com/orted-org/logsink/internal/log_manager"
)

type App struct {

	// db store
	store db.Store

	//logger
	logger *log.Logger

	// service quitter signal channel map
	quitters map[string]chan struct{}

	// channel for os signals
	osSignal chan os.Signal

	// http server
	srv *http.Server

	// user auth service
	userAuthService *authservice.UserAuthService

	// service auth service
	serviceAuthService *authservice.ServiceAuthService

	// log manager
	logManager *logmanager.LogManager

	// log broadcaster
	logBroadcaster *logbroadcaster.LogBroadcaster
}

var (
	lo = log.New(os.Stdout, "",
		log.Ldate|log.Ltime|log.Lshortfile)
)

func main() {

	// init app
	app := &App{
		quitters: make(map[string]chan struct{}),
		logger:   lo,
	}

	// init env and conf
	initConfig(app)

	// init store
	store, err := initDB()
	if err != nil {
		log.Fatal("error initializing db store", err)
		return
	}
	app.store = store

	// init auth service
	initAuthService(app)

	// cleaner for cleaning the open resources when server shuts down
	go initCleaner(app)

	// init any extra auxillary services
	initAuxillary()

	initLogManager(app)

	go initLogBroadcaster(app)
	// server
	initServer(app)
	app.logger.Fatal(app.srv.ListenAndServe())
}
