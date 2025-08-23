// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'
// import * as schema from './schema'
//
// // Get the database URL from environment variables
// const connectionString = process.env.DATABASE_URL
//
// if (!connectionString) {
//   throw new Error('DATABASE_URL environment variable is required')
// }
//
// // Create the postgres client
// // Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
// const client = postgres(connectionString, {
//   prepare: false,
//   max: 10,
// })
//
// // Create the drizzle database instance
// export const db = drizzle({ client, schema })
//
// export type Database = typeof db


// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as schema from './schema';
//
// // You can specify any property from the node-postgres connection options
// export const db = drizzle({
//   connection: {
//     connectionString: process.env.DATABASE_URL!,
//     ssl: { rejectUnauthorized: false }
//   },
//   schema
// });


import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
