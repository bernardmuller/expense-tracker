import type { AppContext } from "@/lib/db/context";
import { expenses, budgets } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq, desc, and } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Transaction } from "../types";
import type { Budget } from "@/lib/db/schema";
import {
  decrypt,
  isEncrypted,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const getActiveBudgetByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> =>
  ResultAsync.fromPromise(
    ctx.db.query.budgets.findFirst({
      where: and(eq(budgets.userId, userId), eq(budgets.isActive, true)),
      with: {
        expenses: {
          orderBy: desc(expenses.createdAt),
          limit: 5,
          with: {
            category: true,
          },
        },
        categoryBudgets: {
          with: {
            category: true,
          },
        },
      },
    }),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen((budget) => {
    if (!budget) {
      return errAsync(
        new EntityNotFoundError(`Active budget for user ${userId}`),
      );
    }

    return (isEncrypted(
      budget.currentAmount,
      budget.ca_iv,
      budget.ca_tag,
    )
      ? ResultAsync.fromPromise(
          decrypt(budget.currentAmount, budget.ca_iv!, budget.ca_tag!),
          (error) =>
            error instanceof EncryptionDecipherCreationError ||
            error instanceof EncryptionDecipherUpdateError ||
            error instanceof EncryptionDecipherFinalError
              ? error
              : new EntityReadError("Budget", String(error)),
        ).andThen((result) => result)
      : okAsync(budget.currentAmount)).andThen((decryptedAmount) => okAsync({
      id: budget.id,
      userId: budget.userId,
      name: budget.name,
      startAmount: budget.startAmount,
      currentAmount: decryptedAmount,
      sa_iv: budget.sa_iv,
      sa_tag: budget.sa_tag,
      ca_iv: budget.ca_iv,
      ca_tag: budget.ca_tag,
      isActive: budget.isActive,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      deletedAt: budget.deletedAt,
      expenses: budget.expenses,
    }));
  });
