ALTER TABLE "budgets" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "budget_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user_categories" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user_categories" ALTER COLUMN "category_id" SET DATA TYPE integer;