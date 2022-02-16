package main

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	db "github.com/orted-org/logsink/db/dao"
	logmanager "github.com/orted-org/logsink/internal/log_manager"
	"github.com/orted-org/logsink/util"
)

func main() {
	var store db.Store = db.NewDB(util.GetDBConnection())
	lm := initLogManager(store)

	n := 100000
	for i := 0; i < n; i++ {
		service, log := util.RandomLog()
		lm.PutLog(log, service)
	}

}

func initLogManager(store db.Store) *logmanager.LogManager {

	// getting the config for log manager

	// max batch size before writing to store (db)
	batchSizeStr := os.Getenv("BATCH_SIZE")

	// max duration to wait before writing to store
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

	logManager := logmanager.New(bs, md, func(data []interface{}, service, logType string) {
		if len(data) == 0 {
			return
		}

		// appending srv_ to service name for distinguishing services from other collections
		err := store.AddManyLogs(context.Background(), data, "srv_"+service, logType)
		if err != nil {
			log.Println("could not put logs to db", err)
		}
	})

	return logManager
}
