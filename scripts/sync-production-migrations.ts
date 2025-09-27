import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(connectionString);
const db = drizzle(sql);

interface MigrationRecord {
  hash: string;
  created_at: number;
}

const existingMigrations: MigrationRecord[] = [
  { hash: '0000_calm_hulk', created_at: 1755701046316 },
  { hash: '0001_confused_exodus', created_at: 1755703578322 },
  { hash: '0002_uneven_scalphunter', created_at: 1756237205362 },
  { hash: '0003_production_sync', created_at: 1755494709829 },
  { hash: '0004_open_fenris', created_at: 1756334764268 },
  { hash: '0005_glorious_joseph', created_at: 1757708150738 }
];

const newMigration: MigrationRecord = {
  hash: '0006_faulty_harpoon',
  created_at: 1759010505241
};

async function syncMigrationState() {
  console.log('🔄 Starting migration state synchronization...\n');

  try {
    // Step 1: Create migration table if it doesn't exist
    console.log('📊 Creating migration tracking table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `;
    console.log('✅ Migration table ready\n');

    // Step 2: Check existing migration records
    console.log('🔍 Checking existing migration records...');
    const existingRecords = await sql`
      SELECT hash, created_at FROM "__drizzle_migrations" ORDER BY created_at
    `;
    console.log(`Found ${existingRecords.length} existing migration records:`, existingRecords);
    console.log('');

    // Step 3: Insert missing migration records for existing structure
    console.log('📝 Inserting missing migration records...');
    for (const migration of existingMigrations) {
      const exists = existingRecords.some(record => record.hash === migration.hash);
      if (!exists) {
        await sql`
          INSERT INTO "__drizzle_migrations" (hash, created_at)
          VALUES (${migration.hash}, ${migration.created_at})
        `;
        console.log(`✅ Added migration record: ${migration.hash}`);
      } else {
        console.log(`⏭️  Migration already exists: ${migration.hash}`);
      }
    }
    console.log('');

    // Step 4: Check if onboarded column exists
    console.log('🔍 Checking if onboarded column exists...');
    const columnCheck = await sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'onboarded'
    `;

    const onboardedExists = columnCheck.length > 0;
    console.log(`Onboarded column exists: ${onboardedExists}`);
    if (onboardedExists) {
      console.log('Column details:', columnCheck[0]);
    }
    console.log('');

    // Step 5: Check if unique constraint exists
    console.log('🔍 Checking if unique constraint exists...');
    const constraintCheck = await sql`
      SELECT tc.constraint_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'user_categories'
        AND tc.constraint_type = 'UNIQUE'
        AND kcu.column_name IN ('user_id', 'category_id')
    `;

    const constraintExists = constraintCheck.length >= 2; // Should have both user_id and category_id
    console.log(`Unique constraint exists: ${constraintExists}`);
    if (constraintExists) {
      console.log('Constraint details:', constraintCheck);
    }
    console.log('');

    // Step 6: Handle the new migration
    const migrationExists = existingRecords.some(record => record.hash === newMigration.hash) ||
                           (await sql`SELECT hash FROM "__drizzle_migrations" WHERE hash = ${newMigration.hash}`).length > 0;

    if (onboardedExists && constraintExists && !migrationExists) {
      // Both changes already exist, just mark migration as applied
      console.log('✅ Both onboarded column and unique constraint already exist');
      console.log('📝 Marking migration 0006 as applied...');
      await sql`
        INSERT INTO "__drizzle_migrations" (hash, created_at)
        VALUES (${newMigration.hash}, ${newMigration.created_at})
      `;
      console.log('✅ Migration 0006 marked as applied');
    } else if (!onboardedExists || !constraintExists) {
      // Need to apply the changes
      console.log('🔧 Applying missing changes...');

      if (!onboardedExists) {
        console.log('📝 Adding onboarded column...');
        await sql`ALTER TABLE "users" ADD COLUMN "onboarded" boolean NOT NULL DEFAULT false`;
        console.log('✅ Onboarded column added');
      }

      if (!constraintExists) {
        console.log('📝 Adding unique constraint...');
        await sql`ALTER TABLE "user_categories" ADD CONSTRAINT "user_categories_user_id_category_id_unique" UNIQUE("user_id","category_id")`;
        console.log('✅ Unique constraint added');
      }

      if (!migrationExists) {
        console.log('📝 Marking migration 0006 as applied...');
        await sql`
          INSERT INTO "__drizzle_migrations" (hash, created_at)
          VALUES (${newMigration.hash}, ${newMigration.created_at})
        `;
        console.log('✅ Migration 0006 marked as applied');
      }
    } else {
      console.log('ℹ️  Migration 0006 already applied, nothing to do');
    }
    console.log('');

    // Final verification
    console.log('🔍 Final verification...');
    const finalMigrations = await sql`
      SELECT hash, created_at FROM "__drizzle_migrations" ORDER BY created_at
    `;
    console.log('Migration records:');
    finalMigrations.forEach(migration => {
      const timestamp = migration.created_at;
      let dateString = 'Invalid date';

      try {
        // Handle both number and string timestamps
        const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
        if (!isNaN(numericTimestamp) && numericTimestamp > 0) {
          dateString = new Date(numericTimestamp).toISOString();
        }
      } catch (error) {
        // Keep default 'Invalid date' if conversion fails
      }

      console.log(`  - ${migration.hash} (${dateString}) [raw: ${timestamp}]`);
    });

    console.log('\n🎉 Migration state synchronization completed successfully!');
    console.log('✅ You can now run normal drizzle migrations on this database');

  } catch (error) {
    console.error('❌ Error during migration sync:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the sync
syncMigrationState().catch(console.error);