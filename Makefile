test:
	go test -v -cover ./...
dev:
	go run cmd/http-server/*.go
.PHONY: test 