CREATE TABLE "budget_recurring_expenses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"budget_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"category_id" uuid,
	"is_paid" boolean DEFAULT false NOT NULL,
	"expense_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "recurring_expense_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"category_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "budget_recurring_expenses" ADD CONSTRAINT "budget_recurring_expenses_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_recurring_expenses" ADD CONSTRAINT "budget_recurring_expenses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_recurring_expenses" ADD CONSTRAINT "budget_recurring_expenses_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_expense_templates" ADD CONSTRAINT "recurring_expense_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_expense_templates" ADD CONSTRAINT "recurring_expense_templates_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "budget_recurring_expenses_budget_id_idx" ON "budget_recurring_expenses" USING btree ("budget_id");--> statement-breakpoint
CREATE INDEX "budget_recurring_expenses_budget_id_deleted_at_idx" ON "budget_recurring_expenses" USING btree ("budget_id","deleted_at");--> statement-breakpoint
CREATE INDEX "budget_recurring_expenses_expense_id_idx" ON "budget_recurring_expenses" USING btree ("expense_id");--> statement-breakpoint
CREATE INDEX "recurring_expense_templates_user_id_idx" ON "recurring_expense_templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recurring_expense_templates_user_id_deleted_at_idx" ON "recurring_expense_templates" USING btree ("user_id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "recurring_expense_templates_user_id_description_active_uq" ON "recurring_expense_templates" USING btree ("user_id","description") WHERE "recurring_expense_templates"."deleted_at" IS NULL;