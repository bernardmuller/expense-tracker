-- Add encryption columns to budgets table
ALTER TABLE "budgets" ADD COLUMN "sa_iv" varchar;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "sa_tag" varchar;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "ca_iv" varchar;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "ca_tag" varchar;--> statement-breakpoint

-- Change amount columns from numeric to varchar for encryption
ALTER TABLE "budgets" ALTER COLUMN "start_amount" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "current_amount" SET DATA TYPE varchar;--> statement-breakpoint

-- Update expenses table category column to category_id with FK if not already done
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'category') THEN
        -- Rename and change type
        ALTER TABLE "expenses" RENAME COLUMN "category" TO "category_id";
        ALTER TABLE "expenses" ALTER COLUMN "category_id" SET DATA TYPE uuid USING NULL;
        ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END$$;
