import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/lib/db/testUtils";
import * as TransactionOperations from "./operations";
import * as UserOperations from "../users/operations";
import { generateMockCategory } from "@/test/mocks/category.mock";
import type { AppContext } from "@/lib/db/context";
import { categories } from "@/lib/db/schema";

const createTestCategory = async (ctx: AppContext) => {
  const mockCategory = generateMockCategory();
  const [createdCategory] = await ctx.db
    .insert(categories)
    .values(mockCategory)
    .returning();

  if (!createdCategory) {
    throw new Error("Failed to create test category");
  }

  return createdCategory;
};

describe("Transaction Operations", () => {
  describe("createTransaction", () => {
    test("should create transaction and update budget successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Test User", email: "test@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const category = await createTestCategory(ctx);

        const onboardResult = await UserOperations.onboardUser(
          userId,
          {
            name: "Test Budget",
            startAmount: 10000,
            categories: [{ id: category.id, icon: category.icon, label: category.label, amount: 5000 }],
          },
          ctx,
        );
        expect(onboardResult.isOk()).toBe(true);

        const activeBudgetResult =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);
        expect(activeBudgetResult.isOk()).toBe(true);
        const budget = activeBudgetResult._unsafeUnwrap();

        const transactionResult = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Test transaction",
            amount: 150.50,
            categoryId: category.id,
          },
          ctx,
        );

        expect(transactionResult.isOk()).toBe(true);
        if (transactionResult.isOk()) {
          const transaction = transactionResult.value;
          expect(transaction.description).toBe("Test transaction");
          expect(transaction.amount).toBe("150.5");
          expect(transaction.categoryId).toBe(category.id);
          expect(transaction.budgetId).toBe(budget.id);
        }

        const updatedBudgetResult =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);
        expect(updatedBudgetResult.isOk()).toBe(true);
        if (updatedBudgetResult.isOk()) {
          const updatedBudget = updatedBudgetResult.value;
          expect(updatedBudget.currentAmount).toBe("9849.5");
        }
      });
    });

    test("should allow budget to go negative", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Test User", email: "test2@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const category = await createTestCategory(ctx);

        await UserOperations.onboardUser(
          userId,
          {
            name: "Small Budget",
            startAmount: 100,
            categories: [{ id: category.id, icon: category.icon, label: category.label, amount: 50 }],
          },
          ctx,
        );

        const activeBudgetResult =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);
        const budget = activeBudgetResult._unsafeUnwrap();

        const transactionResult = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Large expense",
            amount: 200.00,
            categoryId: category.id,
          },
          ctx,
        );

        expect(transactionResult.isOk()).toBe(true);

        const updatedBudgetResult =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);
        if (updatedBudgetResult.isOk()) {
          const updatedBudget = updatedBudgetResult.value;
          expect(parseFloat(updatedBudget.currentAmount)).toBeLessThan(0);
          expect(updatedBudget.currentAmount).toBe("-100");
        }
      });
    });

    test("should fail when budget does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const category = await createTestCategory(ctx);

        const result = await TransactionOperations.createTransaction(
          "00000000-0000-0000-0000-000000000000",
          {
            description: "Test",
            amount: 100,
            categoryId: category.id,
          },
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });

    test("should fail when category does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Test User", email: "test3@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const category = await createTestCategory(ctx);

        await UserOperations.onboardUser(
          userId,
          {
            name: "Test Budget",
            startAmount: 1000,
            categories: [{ id: category.id, icon: category.icon, label: category.label, amount: 500 }],
          },
          ctx,
        );

        const activeBudgetResult =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);
        const budget = activeBudgetResult._unsafeUnwrap();

        const result = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Test",
            amount: 100,
            categoryId: "00000000-0000-0000-0000-000000000000",
          },
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe("getActiveBudgetWithExpenses", () => {
    test("should return active budget with last 5 expenses", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Test User", email: "test4@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const category = await createTestCategory(ctx);

        await UserOperations.onboardUser(
          userId,
          {
            name: "Test Budget",
            startAmount: 10000,
            categories: [{ id: category.id, icon: category.icon, label: category.label, amount: 5000 }],
          },
          ctx,
        );

        const budgetResult =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);
        const budget = budgetResult._unsafeUnwrap();

        for (let i = 0; i < 7; i++) {
          await TransactionOperations.createTransaction(
            budget.id,
            {
              description: `Transaction ${i + 1}`,
              amount: 10,
              categoryId: category.id,
            },
            ctx,
          );
        }

        const result =
          await TransactionOperations.getActiveBudgetWithExpenses(userId, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const budgetWithExpenses = result.value;
          expect(budgetWithExpenses.expenses.length).toBe(5);
          const firstExpense = budgetWithExpenses.expenses[0];
          expect(firstExpense).toBeDefined();
          expect(firstExpense?.category).toBeDefined();
          expect(firstExpense?.category.label).toBe(category.label);
        }
      });
    });

    test("should fail when user has no active budget", async () => {
      await withTestTransaction(async (ctx) => {
        const result =
          await TransactionOperations.getActiveBudgetWithExpenses(
            "00000000-0000-0000-0000-000000000000",
            ctx,
          );

        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe("getUserCategories", () => {
    test("should return user's categories", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Test User", email: "test5@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const category1 = await createTestCategory(ctx);
        const category2 = await createTestCategory(ctx);
        const category3 = await createTestCategory(ctx);

        await UserOperations.onboardUser(
          userId,
          {
            name: "Test Budget",
            startAmount: 10000,
            categories: [
              {
                id: category1.id,
                icon: category1.icon,
                label: category1.label,
                amount: 1000,
              },
              {
                id: category2.id,
                icon: category2.icon,
                label: category2.label,
                amount: 1000,
              },
              {
                id: category3.id,
                icon: category3.icon,
                label: category3.label,
                amount: 1000,
              },
            ],
          },
          ctx,
        );

        const result = await TransactionOperations.getUserCategories(
          userId,
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const userCategories = result.value;
          expect(userCategories.length).toBe(3);
          expect(userCategories[0]).toHaveProperty("id");
          expect(userCategories[0]).toHaveProperty("key");
          expect(userCategories[0]).toHaveProperty("label");
          expect(userCategories[0]).toHaveProperty("icon");
        }
      });
    });
  });
});
