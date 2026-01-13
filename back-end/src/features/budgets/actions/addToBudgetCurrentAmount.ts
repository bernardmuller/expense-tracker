import { ResultAsync, okAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import {
  decrypt,
  isEncrypted,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const addToBudgetCurrentAmount = (
  budget: Budget,
  deletedExpenseAmount: number,
): ResultAsync<
  Budget,
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => {
  if (isEncrypted(budget.currentAmount, budget.ca_iv, budget.ca_tag)) {
    return ResultAsync.fromPromise(
      decrypt(budget.currentAmount, budget.ca_iv!, budget.ca_tag!),
      (error) =>
        error instanceof EncryptionDecipherCreationError ||
        error instanceof EncryptionDecipherUpdateError ||
        error instanceof EncryptionDecipherFinalError
          ? error
          : new EncryptionDecipherFinalError(),
    )
      .andThen((decryptResult) => decryptResult)
      .map((decryptedAmount: string) => {
        const currentAmount = parseFloat(decryptedAmount);
        const newAmount = currentAmount + deletedExpenseAmount;

        return {
          ...budget,
          currentAmount: newAmount.toString(),
          updatedAt: new Date(),
        };
      });
  } else {
    const currentAmount = parseFloat(budget.currentAmount);
    const newAmount = currentAmount + deletedExpenseAmount;

    return okAsync({
      ...budget,
      currentAmount: newAmount.toString(),
      updatedAt: new Date(),
    });
  }
};
