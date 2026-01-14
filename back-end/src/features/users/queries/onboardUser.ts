import type { AppContext } from "@/lib/db/context";
import {
  budgets,
  categories,
  userCategories,
  categoryBudgets,
  userPreferences,
  users,
} from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import {
  encrypt,
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
} from "@/lib/utils/encryption";
import { generateUuid } from "@/lib/utils/generateUuid";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import type { User, OnboardingParams } from "../types";
import { findById } from "./findById";

export const onboardUser = (
  userId: string,
  params: OnboardingParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> =>
  findById(userId, ctx).andThen(() =>
    ResultAsync.fromPromise(
      ctx.db.transaction(async (tx) => {
        const budgetId = generateUuid();
        const now = new Date();

        const encryptStartResult = await encrypt(params.startAmount.toString());
        if (encryptStartResult.isErr()) {
          throw encryptStartResult.error;
        }
        const encryptedStart = encryptStartResult.value;

        const encryptCurrentResult = await encrypt(
          params.startAmount.toString(),
        );
        if (encryptCurrentResult.isErr()) {
          throw encryptCurrentResult.error;
        }
        const encryptedCurrent = encryptCurrentResult.value;

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

        if (!budget) throw new EntityCreateError("Budget");

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

        if (!updatedUser) throw new EntityUpdateError("User");

        console.log("user");

        return updatedUser;
      }),
      (error) =>
        error instanceof EntityCreateError ||
        error instanceof EntityUpdateError ||
        error instanceof EncryptionCipherCreationError ||
        error instanceof EncryptionCipherUpdateError ||
        error instanceof EncryptionCipherFinalError
          ? error
          : new EntityCreateError("Onboarding", error),
    ),
  );
