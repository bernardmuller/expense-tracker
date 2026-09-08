import type { AppContext } from "@/lib/db/context";
import {
  budgets,
  categories,
  userCategories,
  categoryBudgets,
  userPreferences,
  users,
} from "@/lib/db/schema";
import { encrypt } from "@/lib/utils/encryption";
import { generateUuid } from "@/lib/utils/generateUuid";
import { eq } from "drizzle-orm";
import type { User, OnboardingParams } from "../types/index";
import { findById } from "./findById";
import { AppResult, fromEncryption, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const onboardUser = (
  userId: string,
  params: OnboardingParams,
  ctx: AppContext,
): AppResult<User> =>
  findById(userId, ctx).andThen(() =>
    encrypt(params.startAmount.toString()).andThen(
      (encryptedStart) =>
        encrypt(params.startAmount.toString()).andThen(
          (encryptedCurrent) =>
            fromDB(
              ctx.db.transaction(async (tx) => {
                const budgetId = generateUuid();
                const now = new Date();

                const [budget] = await tx
                  .insert(budgets)
                  .values({
                    id: budgetId,
                    userId,
                    name: params.name,
                    startAmount: encryptedStart.ciphertext,
                    currentAmount: encryptedCurrent.ciphertext,
                    sa_iv: encryptedStart.iv,
                    sa_tag: encryptedStart.tag,
                    ca_iv: encryptedCurrent.iv,
                    ca_tag: encryptedCurrent.tag,
                    isActive: true,
                    startDate: params.startDate,
                    endDate: params.endDate,
                    createdAt: now,
                    updatedAt: now,
                  })
                  .returning();

                if (!budget) throw new DatabaseError("Failed to create budget");

                await tx
                  .update(userPreferences)
                  .set({
                    budgetStartDate: params.budgetStartDay,
                    frequency: params.budgetFrequency,
                    customDuration: params.customDuration,
                    updatedAt: now,
                  })
                  .where(eq(userPreferences.userId, userId));

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

                const [updatedUser] = await tx
                  .update(users)
                  .set({
                    onboarded: true,
                    updatedAt: now,
                  })
                  .where(eq(users.id, userId))
                  .returning();

                if (!updatedUser)
                  throw new DatabaseError("Failed to update user");

                return updatedUser;
              }),
            ),
        ),
    ),
  );
