include make/db.mk
include make/test_db.mk
include make/redis.mk
include make/test_redis.mk

EASYJSON_PATHS = ./internal/...

# ===== RUN =====
.PHONY: prod-up
prod-up:
	docker compose -f docker-compose.yml up -d --build db sessions-db api-main balancer

.PHONY: prod-stop
prod-stop:
	docker compose -f docker-compose.yml stop db sessions-db api-main balancer

.PHONY: api-up
api-up:
	docker compose -f docker-compose.yml up -d --build db sessions-db api-main balancer

.PHONY: api-stop
api-stop:
	docker compose -f docker-compose.yml stop db sessions-db api-main balancer

.PHONY: mirror-up
mirror-up:
	docker compose -f docker-compose.yml up -d --build db sessions-db api-mirror

.PHONY: mirror-stop
mirror-stop:
	docker compose -f docker-compose.yml stop db sessions-db api-mirror

.PHONY: monitoring-up
monitoring-up:
	docker compose -f docker-compose.yml up -d --build node-exporter prometheus grafana jaeger

.PHONY: monitoring-stop
monitoring-stop:
	docker compose -f docker-compose.yml stop node-exporter prometheus grafana jaeger

# ===== LOGS =====

service = node-exporter
.PHONY: logs
logs:
	docker compose logs -f "$(service)"

name = main
.PHONY: logs-api
logs-api:
	tail -f -n +1 "cmd/api/logs/$(name).log" | batcat --paging=never --language=log

suite = auth
.PHONY: logs-test
logs-test:
	tail -f -n +1 "tests/logs/$(suite).log" | batcat --paging=never --language=log

# ===== GENERATORS =====

.PHONY: mocks
mocks:
	./scripts/gen_mocks.sh

.PHONY: easyjson
easyjson:
	go generate ${EASYJSON_PATHS}

.PHONY: swag
swag:
	swag init -g cmd/api/main.go

# ===== FORMAT =====

.PHONY: format
format:
	swag fmt

# ===== TESTS =====

.PHONY: test-up
test-up:
	#docker compose -f docker-compose.yml up -d --build db sessions-storage api-main balancer test
	docker compose -f docker-compose.yml up -d --build test-db test-sessions-db test-api test jaeger

.PHONY: test-stop
test-stop:
	docker compose -f docker-compose.yml stop test-db test-sessions-db test-api test jaeger

.PHONY: unit-test
unit-test:
	go test -shuffle=on ./tests/unit/...

.PHONY: integration-test
integration-test:
	go test ./tests/integration/...
	#go test -count=50 -bench ./tests/integration/...

.PHONY: e2e-test
e2e-test:
	go test -v ./tests/e2e/...

.PHONY: unit-cover
unit-cover:
	go test -covermode=atomic -coverprofile=cover.out ./internal/...
	go tool cover -func=cover.out
	go tool cover -html=cover.out -o coverage.html
	@rm cover.out

.PHONY: integration-cover
integration-cover:
	./scripts/db/run_integration_cover.sh
