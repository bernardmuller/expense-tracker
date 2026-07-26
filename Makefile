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
