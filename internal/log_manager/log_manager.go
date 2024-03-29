package logmanager

import (
	"time"

	batchservice "github.com/orted-org/logsink/internal/batch_service"
)

type LogObject struct {
	Service string
	Type    string
	Data    map[string]interface{}
}

type LogManager struct {
	// for batch
	batchSize   int
	maxDuration time.Duration
	ifFlush     func(data []interface{}, service, logType string)

	dataChan  chan LogObject
	closeChan chan struct{}
	services  map[string][3]*batchservice.BatchService
}

func New(batchSize int, maxDuration time.Duration, ifFlush func(data []interface{}, service, logType string)) *LogManager {
	m := &LogManager{
		batchSize:   batchSize,
		maxDuration: maxDuration,
		ifFlush:     ifFlush,

		dataChan:  make(chan LogObject, 100),
		closeChan: make(chan struct{}),
		services:  make(map[string][3]*batchservice.BatchService),
	}

	go m.LogChannelListener()
	return m
}

func (l *LogManager) PutLog(data map[string]interface{}, service string) {

	log := LogObject{
		Service: service,
		Type:    OTHER_LOG_TYPE,
		Data:    data,
	}

	l.PreProcessLog(&log)

	l.dataChan <- log
}

func (l *LogManager) PreProcessLog(log *LogObject) {
	// append timestamp (in correct format)
	finalTs := time.Now()
	if tss, ok := (log.Data["timestamp"]).(string); ok {
		if ts, err := time.Parse(time.RFC3339, tss); err == nil {
			finalTs = ts
		}
	}
	log.Data["timestamp"] = finalTs

	// checking the log type
	if _, ok := log.Data["level"]; ok {
		log.Type = APPLICATION_LOG_TYPE
	} else if _, ok := log.Data["method"]; ok {
		log.Type = HTTP_LOG_TYPE
	}
}

func (l *LogManager) BatchLog(data *LogObject) {
	index := 0

	switch data.Type {
	case APPLICATION_LOG_TYPE:
		index = 0
	case HTTP_LOG_TYPE:
		index = 1
	default:
		index = 2
	}

	// checking if the service is registered
	if _, ok := l.services[data.Service]; !ok {
		l.RegisterService(data.Service)
	}
	// putting the logs into batch
	l.services[data.Service][index].Add(data.Data)

}

// function to register service for batching
func (l *LogManager) RegisterService(name string) {
	if _, ok := l.services[name]; !ok {

		// creating three batches for Application, HTTP and Other Logs
		l.services[name] = [3]*batchservice.BatchService{
			batchservice.New(l.batchSize, l.maxDuration, func(items []interface{}) {
				l.ifFlush(items, name, APPLICATION_LOG_TYPE)
			}),
			batchservice.New(l.batchSize, l.maxDuration, func(items []interface{}) {
				l.ifFlush(items, name, HTTP_LOG_TYPE)
			}),
			batchservice.New(l.batchSize, l.maxDuration, func(items []interface{}) {
				l.ifFlush(items, name, OTHER_LOG_TYPE)
			}),
		}
	}
}

// function to unregister service and close batches
func (l *LogManager) UnregisterService(name string) {
	if srv, ok := l.services[name]; !ok {
		// closing the all the three batches
		for _, v := range srv {
			v.Close()
		}
	}
	// deleting service from map
	delete(l.services, name)
}

func (l *LogManager) LogChannelListener() {
	for {
		select {
		case data := <-l.dataChan:
			l.BatchLog(&data)
		case <-l.closeChan:
			return
		}
	}
}

func (l *LogManager) Close() {
	l.closeChan <- struct{}{}
}
