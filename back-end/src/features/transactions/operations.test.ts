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
  });
});
