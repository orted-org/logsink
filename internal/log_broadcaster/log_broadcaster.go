package logbroadcaster

type LogBroadcaster struct {
	dataChan  chan interface{}
	closeChan chan struct{}
}

func New() *LogBroadcaster {
	return &LogBroadcaster{
		dataChan:  make(chan interface{}, 100),
		closeChan: make(chan struct{}),
	}
}

// function to push logs to channel
func (lb *LogBroadcaster) Push(log interface{}) {
	// just putting the log in the channel
	lb.dataChan <- log
}

// function to listen to logs in channel in blocking fashion
func (lb *LogBroadcaster) Listen(react func(log interface{})) {
	for {
		select {
		case log := <-lb.dataChan:
			react(log)
		case <-lb.closeChan:
			return
		}
	}
}

// function to send close signal to close channel to un-listen to the logs
func (lb *LogBroadcaster) Close() {
	lb.closeChan <- struct{}{}
}
