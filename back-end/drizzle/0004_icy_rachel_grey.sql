ALTER TABLE "budgets" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "frequency" varchar(20);--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "custom_duration" integer;