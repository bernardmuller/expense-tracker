include .env



db_migrate_up:
	@echo "Migrating up..."
	@cd ./store/postgres/schema &&	goose postgres ${POSTGRES_URI} up

db_migrate_down:
	@echo "Migrating down..."
	@cd ./store/postgres/schema &&	goose postgres ${POSTGRES_URI} down

db_generate_queries:
	@echo "Generating queries..."
	@sqlc generate

.PHONY: help
help: ## print make targets 
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: get-install-tailwindcss
get-install-tailwindcss: ## Installs the tailwindcss cli
	curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64
	chmod +x tailwindcss-linux-x64
	mv tailwindcss-linux-x64 tailwindcss

.PHONY: tailwind-watch
tailwind-watch: ## compile tailwindcss and watch for changes
	./tailwindcss -i ./static/css/custom.css -o ./static/css/style.css --watch

.PHONY: tailwind-build
tailwind-build: ## one-time compile tailwindcss styles
	./tailwindcss -i ./static/css/custom.css -o ./static/css/style.css

.PHONY: build
build: ## compile tailwindcss and templ files and build the project
	./tailwindcss -i ./static/css/custom.css -o ./static/css/style.css
	templ generate
	go build -o ./tmp/$(APP_NAME) ./cmd/$(APP_NAME)/main.go

.PHONY: watch
watch: ## build and watch the project with air
	go build -o ./tmp/server ./cmd/server/main.go && air

.PHONY: templ-generate
templ-generate:
	templ generate

.PHONY: templ-watch
templ-watch:
	templ generate --watch

