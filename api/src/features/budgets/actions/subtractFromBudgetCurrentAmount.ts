import { ResultAsync, okAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import { decrypt, isEncrypted } from "@/lib/utils/encryption";
import { EncryptionError } from "@/lib/errors/domain";
import { AppResult } from "@/lib/result";

export const subtractFromBudgetCurrentAmount = (
  budget: Budget,
  transactionAmount: number,
): AppResult<Budget, EncryptionError> => {
  if (isEncrypted(budget.currentAmount, budget.ca_iv, budget.ca_tag)) {
    return decrypt(budget.currentAmount, budget.ca_iv!, budget.ca_tag!).map(
      (decryptedAmount: string) => {
        const currentAmount = parseFloat(decryptedAmount);
        const newAmount = currentAmount - transactionAmount;

        return {
          ...budget,
          currentAmount: newAmount.toString(),
          updatedAt: new Date(),
        };
      },
    );
  } else {
    const currentAmount = parseFloat(budget.currentAmount);
    const newAmount = currentAmount - transactionAmount;

    return okAsync({
      ...budget,
      currentAmount: newAmount.toString(),
      updatedAt: new Date(),
    });
  }
};
