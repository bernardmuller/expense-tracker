import "dotenv/config";
import { generateUuid } from "@/lib/utils/generateUuid";
import { db } from "./index";
import {
  accounts,
  budgets,
  categories,
  categoryBudgets,
  expenses,
  userCategories,
  users,
  type NewBudget,
  type NewCategoryBudget,
  type NewExpense,
} from "./schema";
import {
  generateCategoryIds,
  generateDefaultCategories,
} from "./seed-categories";

export async function seedDatabase() {
  try {
    // Clean up existing data in correct order (respecting foreign key constraints)
    console.log("Cleaning up existing data...");
    await db.delete(expenses);
    await db.delete(categoryBudgets);
    await db.delete(budgets);
    await db.delete(userCategories);
    await db.delete(accounts);
    await db.delete(users);
    await db.delete(categories);
    console.log("Cleanup completed.");

    // Generate all IDs at execution time
    const categoryIds = generateCategoryIds();
    const defaultCategories = generateDefaultCategories(categoryIds);
    const USER_ID = generateUuid();
    const BUDGET_ID = generateUuid();
    const CATEGORY_BUDGET_IDS = [
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
    ];
    const USER_CATEGORY_IDS = [
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
    ];
    const EXPENSE_IDS = [
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
      generateUuid(),
    ];

    // Define seed data using generated IDs
    const budgetsData: Array<
      Omit<NewBudget, "createdAt" | "updatedAt" | "deletedAt">
    > = [
      {
        id: BUDGET_ID,
        userId: USER_ID,
        name: "First Test Budget",
        startAmount: "20000.00",
        currentAmount: "3700.00",
        isActive: true,
      },
    ];

    const categoryBudgetsData: Array<
      Omit<NewCategoryBudget, "createdAt" | "updatedAt" | "deletedAt">
    > = [
      {
        id: CATEGORY_BUDGET_IDS[0]!,
        budgetId: BUDGET_ID,
        categoryId: categoryIds["rent"],
        allocatedAmount: "10000.00",
      },
      {
        id: CATEGORY_BUDGET_IDS[1]!,
        budgetId: BUDGET_ID,
        categoryId: categoryIds["groceries"],
        allocatedAmount: "4000.00",
      },
      {
        id: CATEGORY_BUDGET_IDS[2]!,
        budgetId: BUDGET_ID,
        categoryId: categoryIds["eat-out-takeaways"],
        allocatedAmount: "1000.00",
      },
      {
        id: CATEGORY_BUDGET_IDS[3]!,
        budgetId: BUDGET_ID,
        categoryId: categoryIds["entertainment"],
        allocatedAmount: "1000.00",
      },
      {
        id: CATEGORY_BUDGET_IDS[4]!,
        budgetId: BUDGET_ID,
        categoryId: categoryIds["savings"],
        allocatedAmount: "4000.00",
      },
    ];

    const userData = {
      id: USER_ID,
      name: "Developer",
      email: "developer@email.com",
      emailVerified: false,
      image: null,
      createdAt: new Date("2025-09-23 21:24:05.307"),
      updatedAt: new Date("2025-09-23 21:24:05.307"),
    };

    const userCategoriesData = [
      {
        id: USER_CATEGORY_IDS[0]!,
        userId: USER_ID,
        categoryId: categoryIds["rent"],
        createdAt: new Date("2025-09-23 21:38:02.001"),
        updatedAt: new Date("2025-09-23 21:38:02.001"),
      },
      {
        id: USER_CATEGORY_IDS[1]!,
        userId: USER_ID,
        categoryId: categoryIds["groceries"],
        createdAt: new Date("2025-09-23 21:38:02.572"),
        updatedAt: new Date("2025-09-23 21:38:02.572"),
      },
      {
        id: USER_CATEGORY_IDS[2]!,
        userId: USER_ID,
        categoryId: categoryIds["eat-out-takeaways"],
        createdAt: new Date("2025-09-23 21:38:03.313"),
        updatedAt: new Date("2025-09-23 21:38:03.313"),
      },
      {
        id: USER_CATEGORY_IDS[3]!,
        userId: USER_ID,
        categoryId: categoryIds["entertainment"],
        createdAt: new Date("2025-09-23 21:38:05.84"),
        updatedAt: new Date("2025-09-23 21:38:05.84"),
      },
      {
        id: USER_CATEGORY_IDS[4]!,
        userId: USER_ID,
        categoryId: categoryIds["savings"],
        createdAt: new Date("2025-09-23 21:38:07.783"),
        updatedAt: new Date("2025-09-23 21:38:07.783"),
      },
    ];

    // Insert seed data
    for (const category of defaultCategories) {
      await db
        .insert(categories)
        .values({
          ...category,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();
    }

    await db.insert(users).values(userData).onConflictDoNothing();

    for (const userCategory of userCategoriesData) {
      await db
        .insert(userCategories)
        .values(userCategory)
        .onConflictDoNothing();
    }

    for (const budget of budgetsData) {
      await db
        .insert(budgets)
        .values({
          ...budget,
          createdAt: new Date("2025-09-23 21:42:47.023"),
          updatedAt: new Date("2025-09-23 21:44:45.153"),
        })
        .onConflictDoNothing();
    }

    for (const categoryBudget of categoryBudgetsData) {
      await db
        .insert(categoryBudgets)
        .values({
          ...categoryBudget,
          createdAt: new Date("2025-09-23 21:42:47.024"),
          updatedAt: new Date("2025-09-23 21:42:47.024"),
        })
        .onConflictDoNothing();
    }

    console.table([
      {
        Entity: "Categories",
        Count: defaultCategories.length,
        Status: "✓ Seeded",
      },
      { Entity: "Users", Count: 1, Status: "✓ Seeded" },
      { Entity: "Accounts", Count: 1, Status: "✓ Seeded" },
      {
        Entity: "User Categories",
        Count: userCategoriesData.length,
        Status: "✓ Seeded",
      },
      { Entity: "Budgets", Count: budgetsData.length, Status: "✓ Seeded" },
      {
        Entity: "Category Budgets",
        Count: categoryBudgetsData.length,
        Status: "✓ Seeded",
      },
    ]);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  seedDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed script failed:", error);
      process.exit(1);
    });
}
