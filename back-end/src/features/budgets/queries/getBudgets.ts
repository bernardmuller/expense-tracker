import type { AppContext } from "@/lib/db/context";
import { budgets } from "@/lib/db/schema";
import {
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { okAsync, ResultAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import {
  decrypt,
  isEncrypted,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const getBudgets = (
  search: SearchQueries<
    Budget,
    {
      isActive: boolean;
      userId: string;
    }
  >,
  ctx: AppContext,
): ResultAsync<
  Array<Budget>,
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> =>
  ResultAsync.fromPromise(
    buildDrizzleQuery(
      ctx.db.select().from(budgets),
      search,
      {
        userId: (value) => eq(budgets.userId, value),
        isActive: (value) => eq(budgets.isActive, value),
      },
      {
        name: budgets.name,
        isActive: budgets.isActive,
        createdAt: budgets.createdAt,
      },
    ),
    (error) => new EntityReadError("Budget", String(error)),
  ).andThen((budgetsList) => {
    const decryptPromises = budgetsList.map((budget) => {
      const decryptCurrentResult = isEncrypted(
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
        : okAsync(budget.currentAmount);

      const decryptStartResult = isEncrypted(
        budget.startAmount,
        budget.sa_iv,
        budget.sa_tag,
      )
        ? ResultAsync.fromPromise(
            decrypt(budget.startAmount, budget.sa_iv!, budget.sa_tag!),
            (error) =>
              error instanceof EncryptionDecipherCreationError ||
              error instanceof EncryptionDecipherUpdateError ||
              error instanceof EncryptionDecipherFinalError
                ? error
                : new EntityReadError("Budget", String(error)),
          ).andThen((result) => result)
        : okAsync(budget.startAmount);

      return ResultAsync.combine([
        decryptCurrentResult,
        decryptStartResult,
      ]).map(([decryptedCurrentAmount, decryptedStartAmount]) => ({
        ...budget,
        currentAmount: decryptedCurrentAmount,
        startAmount: decryptedStartAmount,
      }));
    });

    return ResultAsync.combine(decryptPromises);
  });
