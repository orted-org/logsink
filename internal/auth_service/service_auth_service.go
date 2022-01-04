package authservice

import (
	"context"
	"time"

	db "github.com/orted-org/logsink/db/dao"
	"github.com/orted-org/logsink/util"
	"go.mongodb.org/mongo-driver/mongo"
)

type ServiceAuthService struct {
	store db.Store
}

func NewSAS(store db.Store) *ServiceAuthService {
	return &ServiceAuthService{
		store: store,
	}
}

func (sas *ServiceAuthService) CreateNewService(ctx context.Context, name, description string) (string, string, error) {
	secret := util.RandomAlphaNumeric(64)
	hash, err := util.HashSecret(secret)
	if err != nil {
		return "", "", err
	}
	arg := db.AddServiceParams{
		Name:        name,
		Description: description,
		Secret:      hash,
		CreatedAt:   time.Now().UTC(),
	}
	res, err := sas.store.AddService(ctx, arg)
	if err != nil {
		return "", "", err
	}
	return res, secret, nil
}

func (sas *ServiceAuthService) AuthenticateService(ctx context.Context, id, secret string) (db.Service, error) {
	service, err := sas.store.GetServiceByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// service does not exists
			return db.Service{}, ErrNotFound
		}
		return db.Service{}, ErrInternalServerError
	}

	err = util.VerifyHashSecret(secret, service.Secret)
	if err != nil {
		return db.Service{}, ErrUnauthorized
	}

	// service is verified
	return service, nil
}
