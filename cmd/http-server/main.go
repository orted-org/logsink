package main

import (
	"log"
	"net/http"
	"os"

	db "github.com/orted-org/logsink/db/dao"
	authservice "github.com/orted-org/logsink/internal/auth_service"
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

	// go func() {
	// 	m := logmanager.New(100, time.Second*3, func(data []interface{}, service, logType string) {
	// 		if len(data) == 0 {
	// 			return
	// 		}
	// 		err := app.store.AddManyLogs(context.Background(), data, "srv_"+service, logType)
	// 		if err != nil {
	// 			fmt.Println("ERROR WHILE SINKING", err)
	// 		}
	// 	})
	// 	billion := 100000
	// 	ts := time.Now()
	// 	for i := 0; i < billion; i++ {
	// 		srv, log := util.RandomLogs()
	// 		m.PutLog(log, srv)
	// 	}
	// 	fmt.Println("Completed In", time.Since(ts).Seconds())
	// }()

	initLogManager(app)

	// server
	initServer(app)
	app.logger.Fatal(app.srv.ListenAndServe())
}
