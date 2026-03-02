import type { AppContext } from "@/lib/db/context";
import { budgets, userCategories, categoryBudgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
import { encrypt } from "@/lib/utils/encryption";
import { generateUuid } from "@/lib/utils/generateUuid";
import { eq } from "drizzle-orm";
import type { CreateBudgetParams } from "../types/types";
import { findById } from "./findById";
import { AppResult, fromEncryption, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

// TODO: Consider moving budget creation logic to budgets feature
// Currently here because it's tightly coupled with user onboarding and user categories
// Requires careful transaction management if moved
export const createNewBudget = (
  userId: string,
  params: CreateBudgetParams,
  ctx: AppContext,
): AppResult<Budget> =>
  findById(userId, ctx).andThen(() =>
    encrypt(params.startAmount.toString()).andThen(
      (encryptedStart) =>
        encrypt(params.startAmount.toString()).andThen(
          (encryptedCurrent) =>
            fromDB(
              ctx.db.transaction(async (tx) => {
                const budgetId = generateUuid();
                const now = new Date();

                await tx
                  .update(budgets)
                  .set({
                    isActive: false,
                    updatedAt: now,
                  })
                  .where(eq(budgets.userId, userId));

                const [budget] = await tx
                  .insert(budgets)
                  .values({
                    id: budgetId,
                    userId,
                    name: params.name,
                    startDate: params.startDate ? new Date(params.startDate) : null,
                    endDate: params.endDate ? new Date(params.endDate) : null,
                    startAmount: encryptedStart.ciphertext,
                    currentAmount: encryptedCurrent.ciphertext,
                    sa_iv: encryptedStart.iv,
                    sa_tag: encryptedStart.tag,
                    ca_iv: encryptedCurrent.iv,
                    ca_tag: encryptedCurrent.tag,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                  })
                  .returning();

                if (!budget) throw new DatabaseError("Failed to create budget");

                const userCategoryInserts = params.categories.map((cat) => ({
                  id: generateUuid(),
                  userId,
                  categoryId: cat.id,
                  createdAt: now,
                  updatedAt: now,
                }));

                await tx
                  .insert(userCategories)
                  .values(userCategoryInserts)
                  .onConflictDoNothing();

                const categoryBudgetInserts = params.categories.map((cat) => ({
                  id: generateUuid(),
                  budgetId,
                  categoryId: cat.id,
                  allocatedAmount: cat.amount.toString(),
                  createdAt: now,
                  updatedAt: now,
                }));

                await tx.insert(categoryBudgets).values(categoryBudgetInserts);

                return budget;
              }),
            ),
        ),
    ),
  );
