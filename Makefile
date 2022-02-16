test:
	go test -v -cover ./...
dev:
	go run cmd/http-server/*.go
seed:
	go run cmd/seeder/*.go
.PHONY: test dev seed