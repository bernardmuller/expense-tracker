import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/lib/db/testUtils";
import * as TransactionOperations from "./services";
import { generateMockCategory } from "@/test/mocks/category.mock";
import { generateMockUser } from "@/test/mocks/user.mock";
import type { AppContext } from "@/lib/db/context";
import { categories, users, budgets } from "@/lib/db/schema";
import { generateUuid } from "@/lib/utils/generateUuid";
import { isEncrypted } from "@/lib/utils/encryption";
import { eq } from "drizzle-orm";

const createTestCategory = async (ctx: AppContext) => {
  const mockCategory = generateMockCategory({
    key: `test-category-${generateUuid()}`,
  });
  const [createdCategory] = await ctx.db
    .insert(categories)
    .values(mockCategory)
    .returning();

  if (!createdCategory) {
    throw new Error("Failed to create test category");
  }

  return createdCategory;
};

const createTestUser = async (ctx: AppContext) => {
  const mockUser = generateMockUser();
  const [createdUser] = await ctx.db
    .insert(users)
    .values(mockUser)
    .returning();

  if (!createdUser) {
    throw new Error("Failed to create test user");
  }

  return createdUser;
};

const createTestBudget = async (
  ctx: AppContext,
  userId: string,
  startAmount: string = "10000.00",
  currentAmount: string = "10000.00",
) => {
  const [createdBudget] = await ctx.db
    .insert(budgets)
    .values({
      id: generateUuid(),
      userId,
      name: "Test Budget",
      startAmount,
      currentAmount,
      isActive: true,
      sa_iv: null,
      sa_tag: null,
      ca_iv: null,
      ca_tag: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
    .returning();

  if (!createdBudget) {
    throw new Error("Failed to create test budget");
  }

  return createdBudget;
};

describe("Transaction Operations", () => {
  describe("createTransaction", () => {
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

    test("should create transaction and update budget with encryption", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const budget = await createTestBudget(ctx, user.id);

        const result = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Test Transaction",
            amount: 150.5,
            categoryId: category.id,
          },
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const transaction = result.value;
          expect(transaction.description).toBe("Test Transaction");
          expect(transaction.amount).toBe("150.50");
          expect(transaction.budgetId).toBe(budget.id);

          // Verify budget was updated and encrypted
          const [updatedBudget] = await ctx.db
            .select()
            .from(budgets)
            .where(eq(budgets.id, budget.id));

          expect(updatedBudget).toBeTruthy();
          if (updatedBudget) {
            expect(updatedBudget.ca_iv).toBeTruthy();
            expect(updatedBudget.ca_tag).toBeTruthy();
            // Verify currentAmount is encrypted (critical field that changes)
            expect(
              isEncrypted(
                updatedBudget.currentAmount,
                updatedBudget.ca_iv,
                updatedBudget.ca_tag,
              ),
            ).toBe(true);
          }
        }
      });
    });

    test("should fail when category does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const budget = await createTestBudget(ctx, user.id);

        const result = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Test Transaction",
            amount: 100,
            categoryId: "00000000-0000-0000-0000-000000000000",
          },
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe("deleteTransactionAndUpdateBudget", () => {
    test("should delete transaction and restore budget with encryption", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const budget = await createTestBudget(ctx, user.id);

        // Create a transaction first
        const createResult = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Test Transaction",
            amount: 150.5,
            categoryId: category.id,
          },
          ctx,
        );

        expect(createResult.isOk()).toBe(true);
        if (createResult.isOk()) {
          const transaction = createResult.value;

          // Delete the transaction
          const deleteResult =
            await TransactionOperations.deleteTransactionAndUpdateBudget(
              user.id,
              budget.id,
              transaction.id,
              ctx,
            );

          expect(deleteResult.isOk()).toBe(true);
          if (deleteResult.isOk()) {
            const deletedTransaction = deleteResult.value;
            expect(deletedTransaction.id).toBe(transaction.id);

            // Verify budget was restored and encrypted
            const [updatedBudget] = await ctx.db
              .select()
              .from(budgets)
              .where(eq(budgets.id, budget.id));

            expect(updatedBudget).toBeTruthy();
            if (updatedBudget) {
              expect(updatedBudget.ca_iv).toBeTruthy();
              expect(updatedBudget.ca_tag).toBeTruthy();
              // Verify currentAmount is encrypted (critical field that changes)
              expect(
                isEncrypted(
                  updatedBudget.currentAmount,
                  updatedBudget.ca_iv,
                  updatedBudget.ca_tag,
                ),
              ).toBe(true);
            }
          }
        }
      });
    });

    test("should fail when transaction does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const budget = await createTestBudget(ctx, user.id);

        const result =
          await TransactionOperations.deleteTransactionAndUpdateBudget(
            user.id,
            budget.id,
            "00000000-0000-0000-0000-000000000000",
            ctx,
          );

        expect(result.isErr()).toBe(true);
      });
    });

    test("should fail when budget does not exist", async () => {
      await withTestTransaction(async (ctx) => {
        const user = await createTestUser(ctx);
        const category = await createTestCategory(ctx);
        const budget = await createTestBudget(ctx, user.id);

        const createResult = await TransactionOperations.createTransaction(
          budget.id,
          {
            description: "Test Transaction",
            amount: 100,
            categoryId: category.id,
          },
          ctx,
        );

        expect(createResult.isOk()).toBe(true);
        if (createResult.isOk()) {
          const transaction = createResult.value;

          const result =
            await TransactionOperations.deleteTransactionAndUpdateBudget(
              user.id,
              "00000000-0000-0000-0000-000000000000",
              transaction.id,
              ctx,
            );

          expect(result.isErr()).toBe(true);
        }
      });
    });
  });
});
