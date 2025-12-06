import { db } from "../lib/db";
import {
  users,
  sessions,
  accounts,
  verifications,
  categories,
  budgets,
  userCategories,
  categoryBudgets,
  expenses,
} from "../lib/db/schema";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function findLatestDump(): Promise<string | null> {
  const dumpsDir = join(process.cwd(), "dumps");
  const entries = await readdir(dumpsDir, { withFileTypes: true });

  const dumpFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  if (dumpFolders.length === 0) {
    return null;
  }
  // @ts-ignore: it's fine
  return join(dumpsDir, dumpFolders[0]);
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  const content = await readFile(filePath, "utf-8");
  const data = JSON.parse(content) as unknown[];

  return data.map((record) => {
    const converted: Record<string, unknown> = {
      ...(record as Record<string, unknown>),
    };
    for (const [key, value] of Object.entries(converted)) {
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
      ) {
        converted[key] = new Date(value);
      }
    }
    return converted as T;
  });
}

async function clearAllTables() {
  const clearOrder = [
    { table: expenses },
    { table: categoryBudgets },
    { table: userCategories },
    { table: budgets },
    { table: categories },
    { table: verifications },
    { table: accounts },
    { table: sessions },
    { table: users },
  ];

  for (const { table } of clearOrder) {
    await db.delete(table);
  }
}

async function restoreDatabase() {
  try {
    const dumpDir = await findLatestDump();
    if (!dumpDir) {
      process.exit(1);
    }

    const answer = await askQuestion(
      "Are you sure you want to continue? (yes/no): ",
    );

    if (answer.toLowerCase() !== "yes") {
      rl.close();
      process.exit(0);
    }

    rl.close();

    await clearAllTables();

    const restoreOrder = [
      { table: users, file: "users.json" },
      { table: sessions, file: "sessions.json" },
      { table: accounts, file: "accounts.json" },
      { table: verifications, file: "verifications.json" },
      { table: categories, file: "categories.json" },
      { table: budgets, file: "budgets.json" },
      { table: userCategories, file: "user_categories.json" },
      { table: categoryBudgets, file: "category_budgets.json" },
      { table: expenses, file: "expenses.json" },
    ];

    for (const { table, file } of restoreOrder) {
      const filePath = join(dumpDir, file);
      const data = await readJsonFile(filePath);

      if (data.length === 0) {
        continue;
      }

      const batchSize = 100;

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        // @ts-ignore: it's fine
        await db.insert(table).values(batch);
      }
    }

    process.exit(0);
  } catch (error) {
    rl.close();
    process.exit(1);
  }
}

restoreDatabase();
