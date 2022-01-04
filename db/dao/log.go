package db

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (m *MongoDB) AddLog(ctx context.Context, arg interface{}, db, col string) (string, error) {
	coll := m.client.Database(db).Collection(col)
	res, err := coll.InsertOne(ctx, arg)
	if err != nil {
		return "", err
	}
	return ObjectIdToString(res.InsertedID), nil
}

func (m *MongoDB) AddManyLogs(ctx context.Context, arg []interface{}, db, col string) error {
	coll := m.client.Database(db).Collection(col)
	_, err := coll.InsertMany(ctx, arg)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoDB) GetLogs(ctx context.Context, db, col string, limit, offset int64) ([]interface{}, error) {
	coll := m.client.Database(db).Collection(col)
	c, err := coll.Find(ctx, bson.D{}, &options.FindOptions{
		Limit: &limit,
		Skip:  &offset,
	})

	if err != nil {
		return nil, err
	}

	defer c.Close(ctx)
	var items []interface{}
	for c.Next(ctx) {
		var item interface{}
		c.Decode(&item)
		items = append(items, item)
	}

	if err = c.Err(); err != nil {
		return nil, nil
	}

	return items, nil
}
