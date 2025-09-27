-- Safe Production Migration State Sync Script
-- This script synchronizes the migration state between local and production
-- Run this on production DB to enable normal migrations

-- Step 1: Create the migration tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL,
  created_at bigint
);

-- Step 2: Check if migrations are already tracked
-- This query will show which migrations are already recorded
SELECT hash FROM "__drizzle_migrations" ORDER BY created_at;

-- Step 3: Insert missing migration records for existing database structure
-- Only insert if the table is empty or missing specific migrations
INSERT INTO "__drizzle_migrations" (hash, created_at)
SELECT * FROM (VALUES
  ('0000_calm_hulk', 1755701046316),
  ('0001_confused_exodus', 1755703578322),
  ('0002_uneven_scalphunter', 1756237205362),
  ('0003_production_sync', 1755494709829),
  ('0004_open_fenris', 1756334764268),
  ('0005_glorious_joseph', 1757708150738)
) AS v(hash, created_at)
WHERE NOT EXISTS (
  SELECT 1 FROM "__drizzle_migrations" WHERE "__drizzle_migrations".hash = v.hash
);

-- Step 4: Check if the onboarded column already exists
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'onboarded';

-- Step 5: Check if the unique constraint already exists
SELECT
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_categories'
  AND tc.constraint_type = 'UNIQUE'
  AND kcu.column_name IN ('user_id', 'category_id');

-- Step 6A: If the onboarded column EXISTS, mark migration 0006 as applied
-- (Only run this if the column check above shows the column exists)
-- INSERT INTO "__drizzle_migrations" (hash, created_at)
-- VALUES ('0006_faulty_harpoon', 1759010505241);

-- Step 6B: If the onboarded column DOES NOT EXIST, manually apply the changes
-- (Only run this if the column check above shows no column)
-- ALTER TABLE "users" ADD COLUMN "onboarded" boolean NOT NULL DEFAULT false;
-- ALTER TABLE "user_categories" ADD CONSTRAINT "user_categories_user_id_category_id_unique" UNIQUE("user_id","category_id");
-- INSERT INTO "__drizzle_migrations" (hash, created_at)
-- VALUES ('0006_faulty_harpoon', 1759010505241);

-- Final verification: Check migration state
SELECT hash, created_at FROM "__drizzle_migrations" ORDER BY created_at;