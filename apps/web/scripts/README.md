# Production Migration Sync Guide

## Problem
Your production database has all tables created (likely via `drizzle-kit push`), but Drizzle's migration tracking system doesn't know which migrations have been applied. This causes "relation already exists" errors when trying to run migrations.

## Solution
We've created scripts to safely synchronize the migration state without losing any data.

## Files Created
- `sync-migration-state.sql` - Manual SQL commands (if you prefer to run SQL directly)
- `sync-production-migrations.ts` - Automated Node.js script (recommended)

## Usage

### Option 1: Automated Script (Recommended)

1. **Set your production DATABASE_URL**:
   ```bash
   export DATABASE_URL="your_production_database_url"
   ```

2. **Run the sync script**:
   ```bash
   npm run db:sync-migrations
   ```

3. **The script will**:
   - Create the `__drizzle_migrations` table
   - Mark migrations 0000-0005 as applied (existing structure)
   - Check if the `onboarded` column exists
   - Apply migration 0006 if needed (onboarded column + unique constraint)
   - Provide detailed output of what it's doing

4. **After sync, run normal migrations**:
   ```bash
   npm run db:migrate
   ```

### Option 2: Manual SQL Execution

1. Connect to your production database
2. Run the commands in `sync-migration-state.sql` step by step
3. Follow the comments in the file for guidance

## What the Script Does

### Safe Checks
- ✅ Creates migration table only if it doesn't exist
- ✅ Checks existing migration records before inserting
- ✅ Verifies if `onboarded` column already exists
- ✅ Verifies if unique constraint already exists
- ✅ Only applies changes that are missing

### Migration Records Added
The script marks these migrations as "already applied":
- `0000_calm_hulk` - Initial Better Auth tables
- `0001_confused_exodus` - (existing structure)
- `0002_uneven_scalphunter` - (existing structure)
- `0003_production_sync` - (existing structure)
- `0004_open_fenris` - (existing structure)
- `0005_glorious_joseph` - Category budgets table

### Changes Applied (if missing)
Migration `0006_faulty_harpoon`:
- Adds `onboarded` boolean column to `users` table (default: false)
- Adds unique constraint on `user_categories` (user_id, category_id)

## Verification

After running the sync, you can verify the state:

```sql
-- Check migration records
SELECT hash, created_at FROM "__drizzle_migrations" ORDER BY created_at;

-- Verify onboarded column
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'onboarded';

-- Verify unique constraint
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'user_categories' AND constraint_type = 'UNIQUE';
```

## Safety Features

- **No Data Loss**: Only adds migration tracking, doesn't modify existing data
- **Idempotent**: Can be run multiple times safely
- **Detailed Logging**: Shows exactly what it's doing
- **Verification**: Checks before applying any changes

## After Sync

Once the sync is complete:
1. ✅ Future migrations will work normally with `npm run db:migrate`
2. ✅ Local and production will be in sync
3. ✅ The `onboarded` column will be available for the onboarding flow
4. ✅ Duplicate category prevention will work via unique constraint

## Troubleshooting

If you encounter issues:
1. Check your DATABASE_URL is pointing to production
2. Ensure you have database connection permissions
3. Review the script output for specific error messages
4. Verify your database has the expected tables

## Rollback (if needed)

If something goes wrong, you can rollback by:
1. Dropping the `__drizzle_migrations` table: `DROP TABLE "__drizzle_migrations";`
2. Removing the onboarded column: `ALTER TABLE users DROP COLUMN onboarded;`
3. But this should not be necessary as the script is designed to be safe