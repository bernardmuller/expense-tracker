import { db as defaultDb, type DB } from "@/lib/db";

export type AppContext = {
  readonly db: DB;
  // Future additions: logger, cache, config, etc.
};

export const createContext = (db?: DB): AppContext => ({
  db: db ?? defaultDb,
});

export const createTestContext = (tx: DB): AppContext => ({
  db: tx,
});
