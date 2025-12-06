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
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

function jsonSerializer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

async function dumpDatabase() {
  try {
    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "")
      .replace("T", "_");
    const dumpDir = join(process.cwd(), "dumps", timestamp);

    await mkdir(dumpDir, { recursive: true });

    const tables = [
      { name: "users", table: users },
      { name: "sessions", table: sessions },
      { name: "accounts", table: accounts },
      { name: "verifications", table: verifications },
      { name: "categories", table: categories },
      { name: "budgets", table: budgets },
      { name: "user_categories", table: userCategories },
      { name: "category_budgets", table: categoryBudgets },
      { name: "expenses", table: expenses },
    ];

    const summary: Record<string, number> = {};

    for (const { name, table } of tables) {
      const data = await db.select().from(table);
      const filePath = join(dumpDir, `${name}.json`);
      await writeFile(
        filePath,
        JSON.stringify(data, jsonSerializer, 2),
        "utf-8"
      );
      summary[name] = data.length;
    }

    const summaryData = {
      timestamp: new Date().toISOString(),
      dumpDirectory: dumpDir,
      tables: summary,
      totalRecords: Object.values(summary).reduce((a, b) => a + b, 0),
    };

    await writeFile(
      join(dumpDir, "_summary.json"),
      JSON.stringify(summaryData, null, 2),
      "utf-8"
    );

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

dumpDatabase();
