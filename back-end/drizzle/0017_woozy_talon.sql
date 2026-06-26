ALTER TABLE "budget_recurring_expenses" ADD COLUMN "template_id" uuid;--> statement-breakpoint
ALTER TABLE "budget_recurring_expenses" ADD COLUMN "scheduled_at" varchar;--> statement-breakpoint
ALTER TABLE "budget_recurring_expenses" ADD CONSTRAINT "budget_recurring_expenses_template_id_recurring_expense_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."recurring_expense_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "budget_recurring_expenses_template_id_idx" ON "budget_recurring_expenses" USING btree ("template_id");