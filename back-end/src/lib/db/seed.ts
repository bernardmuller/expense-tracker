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

    const expensesData: Array<
      Omit<NewExpense, "createdAt" | "updatedAt" | "deletedAt">
    > = [
      {
        id: EXPENSE_IDS[0]!,
        budgetId: BUDGET_ID,
        description: "Rent",
        amount: "10000.00",
        category: "rent",
      },
      {
        id: EXPENSE_IDS[1]!,
        budgetId: BUDGET_ID,
        description: "Entertainment",
        amount: "200.00",
        category: "entertainment",
      },
      {
        id: EXPENSE_IDS[2]!,
        budgetId: BUDGET_ID,
        description: "Eat-out-takeaways",
        amount: "250.00",
        category: "eat-out-takeaways",
      },
      {
        id: EXPENSE_IDS[3]!,
        budgetId: BUDGET_ID,
        description: "Groceries",
        amount: "1250.00",
        category: "groceries",
      },
      {
        id: EXPENSE_IDS[4]!,
        budgetId: BUDGET_ID,
        description: "Entertainment",
        amount: "600.00",
        category: "entertainment",
      },
      {
        id: EXPENSE_IDS[5]!,
        budgetId: BUDGET_ID,
        description: "Savings",
        amount: "1000.00",
        category: "savings",
      },
      {
        id: EXPENSE_IDS[6]!,
        budgetId: BUDGET_ID,
        description: "Investments",
        amount: "2000.00",
        category: "savings",
      },
      {
        id: EXPENSE_IDS[7]!,
        budgetId: BUDGET_ID,
        description: "Vacation",
        amount: "1000.00",
        category: "savings",
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

    const accountData = {
      id: generateUuid(),
      accountId: generateUuid(),
      providerId: "credential",
      userId: USER_ID,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      // password: "Tester@123"
      password:
        "97e1fe8d5e6d11f56c29ce3c9ca659ed:119dd77d8a419319a40363c499bd4e8bfc02fa9f72b860d6ed06f1bfbb89c7cc69874483f0fa780b716585895127bee35fef525c120465b4568c3e2abc0b97a5",
      createdAt: new Date("2025-09-23 21:24:05.312"),
      updatedAt: new Date("2025-09-23 21:24:05.312"),
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
    await db.insert(accounts).values(accountData).onConflictDoNothing();

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

    for (const expense of expensesData) {
      await db
        .insert(expenses)
        .values({
          ...expense,
          createdAt: new Date(
            expense.description === "Rent"
              ? "2025-09-23 21:43:32.306"
              : expense.description === "Entertainment" &&
                  expense.amount === "200.00"
                ? "2025-09-23 21:43:40.633"
                : expense.description === "Eat-out-takeaways"
                  ? "2025-09-23 21:43:45.649"
                  : expense.description === "Groceries"
                    ? "2025-09-23 21:43:52.687"
                    : expense.description === "Entertainment" &&
                        expense.amount === "600.00"
                      ? "2025-09-23 21:44:01.429"
                      : expense.description === "Savings"
                        ? "2025-09-23 21:44:24.679"
                        : expense.description === "Investments"
                          ? "2025-09-23 21:44:35.256"
                          : "2025-09-23 21:44:45.152",
          ),
          updatedAt: new Date(
            expense.description === "Rent"
              ? "2025-09-23 21:43:32.306"
              : expense.description === "Entertainment" &&
                  expense.amount === "200.00"
                ? "2025-09-23 21:43:40.633"
                : expense.description === "Eat-out-takeaways"
                  ? "2025-09-23 21:43:45.649"
                  : expense.description === "Groceries"
                    ? "2025-09-23 21:43:52.687"
                    : expense.description === "Entertainment" &&
                        expense.amount === "600.00"
                      ? "2025-09-23 21:44:01.429"
                      : expense.description === "Savings"
                        ? "2025-09-23 21:44:24.679"
                        : expense.description === "Investments"
                          ? "2025-09-23 21:44:35.256"
                          : "2025-09-23 21:44:45.152",
          ),
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
      { Entity: "Expenses", Count: expensesData.length, Status: "✓ Seeded" },
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
