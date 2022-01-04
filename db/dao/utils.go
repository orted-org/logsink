package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ObjectIdToString(_id interface{}) string {
	return _id.(primitive.ObjectID).Hex()
}
