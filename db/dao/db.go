package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

type MongoDB struct {
	client *mongo.Client
}

func NewDB(client *mongo.Client) *MongoDB {
	return &MongoDB{
		client: client,
	}
}

func (m *MongoDB) Close(ctx context.Context) error {
	return m.client.Disconnect(ctx)
}

type Store interface {

	//db
	Close(ctx context.Context) error

	//log
	AddLog(ctx context.Context, arg interface{}, service, event string) (string, error)
	AddManyLogs(ctx context.Context, arg []interface{}, service, event string) error
	GetLogs(ctx context.Context, db, col string, limit, offset int64) ([]interface{}, error)

	//service
	AddService(ctx context.Context, arg AddServiceParams) (string, error)
	GetServiceByID(ctx context.Context, ID string) (Service, error)
	DeleteServiceByID(ctx context.Context, id string) error
	UpdateServiceByID(ctx context.Context, id string, arg UpdateServiceByIDParams) (int64, error)
	GetServices(ctx context.Context) ([]Service, error)
}
