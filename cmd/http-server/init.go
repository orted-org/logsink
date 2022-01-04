package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	db "github.com/orted-org/logsink/db/dao"
	authservice "github.com/orted-org/logsink/internal/auth_service"
	logmanager "github.com/orted-org/logsink/internal/log_manager"
	kvstore "github.com/orted-org/logsink/pkg/kv_store"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// function to cleanup the open resources
func initCleaner(app *App) {
	app.osSignal = make(chan os.Signal, 1)
	signal.Notify(app.osSignal, os.Interrupt)
	go func() {
		<-app.osSignal
		ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
		defer cancel()
		app.logger.Println("starting cleaning up")

		// quitting all the running services in go routine
		app.logger.Println("removing all the go routines running services")
		for _, v := range app.quitters {
			v <- struct{}{}
		}

		app.logManager.Close()

		// closing db connection
		app.logger.Println("closing db connection")
		app.store.Close(ctx)

		// waiting to gracefully shutdown all the processes
		app.logger.Println("quitting application in 3s")
		time.Sleep(time.Second * 3)

		// finally shutting down the server
		app.logger.Println("shutting down the http server")
		app.srv.Shutdown(ctx)

		// declaring safe shut down
		os.Exit(0)
	}()
}

func initDB() (db.Store, error) {

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb://localhost:2717"
	}
	c, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	return db.NewDB(c), nil
}

func initServer(app *App) {
	r := chi.NewRouter()

	// TODO: Pass the allowed origins from config
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
	}).Handler)

	initHandler(app, r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8888"
	}

	srv := http.Server{
		Addr:    "0.0.0.0:" + port,
		Handler: r,
	}
	app.srv = &srv

	app.logger.Println("server configured for the address " + srv.Addr)
}

func initConfig(app *App) {
	err := godotenv.Load()
	if err != nil {
		app.logger.Println("could not load confid and env")
	}
	app.logger.Println("initialized config and env store")
}

func initAuthService(app *App) {
	app.userAuthService = authservice.NewUAS(kvstore.New())
	app.serviceAuthService = authservice.NewSAS(app.store)
	app.logger.Println("initialized auth services")
}

func initLogManager(app *App) {
	batchSizeStr := os.Getenv("BATCH_SIZE")
	maxDur := os.Getenv("MAX_DURATION")

	bs := 100
	md := time.Second * 5
	if v, err := strconv.Atoi(batchSizeStr); err == nil {
		if v != 0 {
			bs = v
		}
	}

	if v, err := strconv.Atoi(maxDur); err == nil {
		if v != 0 {
			md = time.Second * time.Duration(v)
		}
	}

	app.logManager = logmanager.New(bs, md, func(data []interface{}, service, logType string) {
		if len(data) == 0 {
			return
		}

		// appending srv_ to service name for distinguishing
		err := app.store.AddManyLogs(context.Background(), data, "srv_"+service, logType)
		if err != nil {
			app.logger.Println("could not put logs to db", err)
		}
	})

}

func initAuxillary() {

}
