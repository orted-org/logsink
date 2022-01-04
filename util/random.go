package util

import (
	"math/rand"
	"strings"
	"time"
)

func init() {
	rand.Seed(time.Now().UTC().UnixNano())
}

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"
const alphaNumeric = numbers + alphabet

func RandomInt(min, max int64) int {
	return int(min + rand.Int63n(max-min+1))
}

func RandomString(size int) string {
	var sb strings.Builder
	k := len(alphabet)
	for i := 0; i < size; i++ {
		sb.WriteByte(alphabet[rand.Intn(k)])
	}
	return sb.String()
}

func RandomBool() bool {
	num := rand.Int63n(2)
	if num == 0 {
		return false
	} else {
		return true
	}
}

func RandomAlphaNumeric(size int) string {
	var sb strings.Builder
	k := len(alphabet)
	for i := 0; i < size; i++ {
		sb.WriteByte(alphaNumeric[rand.Intn(k)])
	}
	return sb.String()
}

func RandomService() string {
	services := []string{"post", "comments", "auth"}
	return services[rand.Intn(len(services))]
}

func RandomMethod() string {
	methods := []string{"GET", "POST", "DELETE", "PUT"}
	return methods[rand.Intn(len(methods))]
}
func RandomLevel() string {
	levels := []string{"TRACE", "DEBUG", "INFO", "ERROR", "WARN", "FATAL"}
	return levels[rand.Intn(len(levels))]
}

func RandomLogs() (string, map[string]interface{}) {
	httpLog := make(map[string]interface{})
	httpLog["method"] = RandomMethod()
	httpLog["path"] = "/" + RandomString(5)
	httpLog["duration"] = RandomInt(20, 300)
	httpLog["code"] = RandomInt(100, 500)
	httpLog["timestamp"] = time.Now().Add(-time.Second * time.Duration(RandomInt(100, 100000)))

	appLog := make(map[string]interface{})
	appLog["level"] = RandomLevel()
	appLog["message"] = RandomString(10)
	appLog["timestamp"] = time.Now().Add(-time.Second * time.Duration(RandomInt(100, 100000)))

	otherLog := make(map[string]interface{})
	otherLog["service"] = RandomService()
	otherLog["message"] = RandomString(10)
	otherLog["timestamp"] = time.Now().Add(-time.Second * time.Duration(RandomInt(100, 100000)))

	logs := [3]map[string]interface{}{
		httpLog, appLog, otherLog,
	}
	return RandomService(), logs[rand.Intn(len(logs))]
}
