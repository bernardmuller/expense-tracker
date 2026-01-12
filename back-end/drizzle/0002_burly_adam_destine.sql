CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"budget_start_date" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
