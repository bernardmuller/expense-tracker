import type { AppContext } from "@/lib/db/context";
import { budgets, userCategories, categoryBudgets } from "@/lib/db/schema";
import type { Budget } from "@/lib/db/schema";
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
import type { CreateBudgetParams } from "../types/types";
import { findById } from "./findById";

// TODO: Consider moving budget creation logic to budgets feature
// Currently here because it's tightly coupled with user onboarding and user categories
// Requires careful transaction management if moved
export const createNewBudget = (
  userId: string,
  params: CreateBudgetParams,
  ctx: AppContext,
): ResultAsync<
  Budget,
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

        await tx
          .update(budgets)
          .set({
            isActive: false,
            updatedAt: now,
          })
          .where(eq(budgets.userId, userId));

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
            startDate: params.startDate && new Date(params.startDate),
            endDate: params.endDate && new Date(params.endDate),
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

        if (!budget) throw new EntityCreateError("Budget");

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
      (error) =>
        error instanceof EntityCreateError ||
        error instanceof EntityUpdateError ||
        error instanceof EncryptionCipherCreationError ||
        error instanceof EncryptionCipherUpdateError ||
        error instanceof EncryptionCipherFinalError
          ? error
          : new EntityCreateError("Budget creation", error),
    ),
  );
