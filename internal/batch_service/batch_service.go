package batchservice

import (
	"sync"
	"time"
)

type BatchService struct {
	maxDuration time.Duration
	ifFlush     func(items []interface{})
	mu          sync.RWMutex
	closeChan   chan struct{}
	lastFlush   time.Time
	repo        *BatchRepo
}

func New(maxSize int, duration time.Duration, ifFlush func(items []interface{})) *BatchService {

	b := &BatchService{
		maxDuration: duration,
		ifFlush:     ifFlush,
		lastFlush:   time.Now(),
		repo:        NewBatchRepo(maxSize),
	}

	go b.BatchFlushScheduler()
	return b
}

func (b *BatchService) Add(item interface{}) {
	b.mu.Lock()
	b.repo.Push(item)
	b.mu.Unlock()
	if b.repo.Size() == b.repo.maxSize {
		// flush
		b.FlushOut()
	}
}

func (b *BatchService) BatchFlushScheduler() {
	ticker := time.NewTicker(b.maxDuration)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if time.Since(b.lastFlush).Seconds() > b.maxDuration.Seconds() {
				// more than maxDuration has escaped and flush has not been performed
				b.FlushOut()
			}
			// flush happened recently
		case <-b.closeChan:
			// got close signal, exiting from scheduler
			return
		}
	}
}

// function to flush out the batched items
func (b *BatchService) FlushOut() {

	b.mu.Lock()
	defer b.mu.Unlock()

	// creating a local copy of repo
	temp := b.repo

	// assigning a new repo to batch
	b.repo = NewBatchRepo(b.repo.maxSize)

	// only considering items from 0 to last index
	if temp.Size() == 0 {
		return
	}
	items := make([]interface{}, temp.Size())
	batchItems := temp.Items()
	for i := 0; i < temp.Size(); i++ {
		if batchItems[i] != nil {
			items[i] = batchItems[i]
		} else {
			break
		}
	}

	// emiting items
	go b.ifFlush(items)

	// setting the flush time to current time
	b.lastFlush = time.Now()
}

func (b *BatchService) Close() {
	b.closeChan <- struct{}{}
}
