package db

import (
	"context"
	"testing"
	"time"

	"github.com/orted-org/logsink/util"
	"github.com/stretchr/testify/require"
)

func createRandomService(t *testing.T) (AddServiceParams, string) {
	arg := AddServiceParams{
		Name:        util.RandomString(10),
		Description: util.RandomString(100),
		CreatedAt:   time.Now().UTC(),
		Secret:      util.RandomAlphaNumeric(64),
	}
	i, err := m.AddService(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, i)

	return arg, i
}

func TestAddService(t *testing.T) {
	createRandomService(t)
}

func TestGetService(t *testing.T) {
	arg, id := createRandomService(t)

	res, err := m.GetServiceByID(context.Background(), id)
	require.NoError(t, err)
	require.NotEmpty(t, res)
	require.Equal(t, arg.Name, res.Name)
	require.Equal(t, arg.Description, res.Description)
	require.Equal(t, arg.Secret, res.Secret)
}

func TestDeleteService(t *testing.T) {
	_, id := createRandomService(t)

	err := m.DeleteServiceByID(context.Background(), id)
	require.NoError(t, err)

	res, err := m.GetServiceByID(context.Background(), id)
	require.Error(t, err)
	require.Empty(t, res)
}

func TestUpdateService(t *testing.T) {
	_, id := createRandomService(t)

	update := UpdateServiceByIDParams{
		Name:        util.RandomString(10),
		Description: util.RandomString(100),
	}

	c, err := m.UpdateServiceByID(context.Background(), id, update)
	require.NoError(t, err)
	require.NotEmpty(t, c)

	res, err := m.GetServiceByID(context.Background(), id)
	require.NoError(t, err)
	require.NotEmpty(t, res)

	require.Equal(t, update.Name, res.Name)
	require.Equal(t, update.Description, res.Description)
}
