package db

import (
	"context"
	"os"
	"testing"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var m *MongoDB

func TestMain(t *testing.M) {
	uri := "mongodb://localhost:2717"
	c, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	m = NewDB(c)
	os.Exit(t.Run())
}
