package authservice

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"time"

	"github.com/google/uuid"
	kvstore "github.com/orted-org/logsink/pkg/kv_store"
)

// session age in seconds
const SessionAge = 24 * 60 * 60

var ErrInternalServerError = errors.New("internal server error")
var ErrUnauthorized = errors.New("unauthorized")
var ErrNotFound = errors.New("not found")

type Session struct {
	ID      string
	Expires time.Time
}

type UserAuthService struct {
	kv kvstore.KVStore
}

func NewUAS(kv kvstore.KVStore) *UserAuthService {
	return &UserAuthService{
		kv: kv,
	}
}

func (as *UserAuthService) PerformLogin(ctx context.Context, username, password string) (Session, error) {
	var session Session

	// getting the username and password for admin from the env
	mustUsername := os.Getenv("ADMIN_USERNAME")
	mustPassword := os.Getenv("ADMIN_PASSWORD")

	// setting the admin's username to default 'admin' if nothing provided in env
	if mustUsername == "" {
		mustUsername = "admin"
	}

	// setting the admin's password to default 'admin' if nothing provided in env
	if mustPassword == "" {
		mustPassword = "admin"
	}

	// checking if the username and password match
	if !(mustUsername == username && mustPassword == password) {
		return Session{}, ErrUnauthorized
	}

	// creating a session
	session = Session{
		ID:      uuid.New().String(),
		Expires: time.Now().UTC().Add(SessionAge * time.Second),
	}

	// session to store to store in kv store
	mData, mErr := json.Marshal(session)
	if mErr != nil {
		return session, ErrInternalServerError
	}

	// storing the session in kv store
	err := as.kv.Set(session.ID, string(mData))
	if err != nil {
		return session, ErrInternalServerError
	}
	return session, nil
}

func (as *UserAuthService) IfLogin(sessionId string) (Session, error) {
	if sessionId == "" {
		return Session{}, ErrUnauthorized
	}

	var session Session
	str, err := as.kv.Get(sessionId)

	if err != nil {
		return session, ErrUnauthorized
	}

	err = json.Unmarshal([]byte(str), &session)
	if err != nil {
		return session, ErrInternalServerError
	}

	if time.Now().UTC().Sub(session.Expires) > 0 {
		//session expired, deleting from kv store
		as.kv.Delete(sessionId)
		return session, ErrUnauthorized
	}
	return session, nil
}

func (as *UserAuthService) PerformLogout(sessionId string) error {
	return as.kv.Delete(sessionId)
}
