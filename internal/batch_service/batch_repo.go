package batchservice

type BatchRepo struct {
	maxSize int
	index   int
	items   []interface{}
}

func NewBatchRepo(maxSize int) *BatchRepo {
	return &BatchRepo{
		maxSize: maxSize,
		index:   -1,
		items:   make([]interface{}, maxSize),
	}
}

func (b *BatchRepo) Push(item interface{}) {
	if b.index < b.maxSize {
		b.index++
		b.items[b.index] = item
	}
}

func (b *BatchRepo) Items() []interface{} {
	return b.items
}

func (b *BatchRepo) Size() int {
	return b.index + 1
}
