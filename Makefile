test:
	go test -v -cover ./...
dev:
	go run cmd/http-server/*.go
seed:
	go run cmd/seeder/*.go
build_fs:
	go build -o app/api cmd/http-server/*.go && cd frontend && yarn build && cp -r build ../app/
run: 
	cd app && ./api
.PHONY: test dev seed build_fs run