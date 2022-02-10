package db

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AddServiceParams struct {
	Name        string    `json:"name,omitempty" bson:"name,omitempty"`
	Description string    `json:"description,omitempty" bson:"description,omitempty"`
	Secret      string    `json:"-" bson:"secret,omitempty"`
	CreatedAt   time.Time `json:"created_at,omitempty" bson:"created_at,omitempty"`
}

func (m *MongoDB) AddService(ctx context.Context, arg AddServiceParams) (string, error) {
	coll := m.client.Database("logsink").Collection("service")

	arg.CreatedAt = time.Now().UTC()
	res, err := coll.InsertOne(ctx, arg)
	if err != nil {
		return "", err
	}
	return ObjectIdToString(res.InsertedID), nil
}

func (m *MongoDB) GetServiceByID(ctx context.Context, ID string) (Service, error) {
	coll := m.client.Database("logsink").Collection("service")
	_id, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		return Service{}, err
	}
	result := coll.FindOne(ctx, Service{ID: _id})
	var service Service
	err = result.Decode(&service)
	if err != nil {
		return Service{}, err
	}
	return service, nil
}

func (m *MongoDB) DeleteServiceByID(ctx context.Context, id string) error {
	coll := m.client.Database("logsink").Collection("service")
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = coll.DeleteOne(ctx, Service{ID: _id})
	if err != nil {
		return err
	}
	return nil
}

type UpdateServiceByIDParams struct {
	Name        string `json:"name,omitempty" bson:"name,omitempty"`
	Description string `json:"description,omitempty" bson:"description,omitempty"`
}

func (m *MongoDB) UpdateServiceByID(ctx context.Context, id string, arg UpdateServiceByIDParams) (int64, error) {
	coll := m.client.Database("logsink").Collection("service")
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return 0, err
	}
	update := bson.D{{"$set", arg}}
	result, err := coll.UpdateOne(ctx, Service{ID: _id}, update)
	if err != nil {
		panic(err)
	}

	return result.ModifiedCount, nil
}

func (m *MongoDB) GetServices(ctx context.Context) ([]Service, error) {
	coll := m.client.Database("logsink").Collection("service")
	c, err := coll.Find(ctx, bson.D{})

	if err != nil {
		return nil, err
	}

	defer c.Close(ctx)
	var items []Service
	for c.Next(ctx) {
		var service Service
		c.Decode(&service)
		items = append(items, service)
	}

	if err = c.Err(); err != nil {
		return nil, nil
	}

	return items, nil
}
