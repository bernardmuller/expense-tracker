import { ResultAsync, okAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import { encrypt } from "@/lib/utils/encryption";
import { EncryptionError } from "@/lib/errors/domain";
import { AppResult } from "@/lib/result";

const isNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const encryptBudgetAmounts = (
  budget: Budget,
): AppResult<Budget, EncryptionError> => {
  const shouldEncryptStart = isNumeric(budget.startAmount);
  const shouldEncryptCurrent = isNumeric(budget.currentAmount);

  if (!shouldEncryptStart && !shouldEncryptCurrent) {
    return okAsync(budget);
  }

  if (shouldEncryptStart && shouldEncryptCurrent) {
    return encrypt(budget.startAmount).andThen(
      (encryptedStart: { ciphertext: string; iv: string; tag: string }) => {
        return encrypt(budget.currentAmount).map(
          (encryptedCurrent: { ciphertext: string; iv: string; tag: string }) => ({
            ...budget,
            startAmount: encryptedStart.ciphertext,
            currentAmount: encryptedCurrent.ciphertext,
            sa_iv: encryptedStart.iv,
            sa_tag: encryptedStart.tag,
            ca_iv: encryptedCurrent.iv,
            ca_tag: encryptedCurrent.tag,
          }),
        );
      },
    );
  }

  if (shouldEncryptStart) {
    return encrypt(budget.startAmount).map(
      (encrypted: { ciphertext: string; iv: string; tag: string }) => ({
        ...budget,
        startAmount: encrypted.ciphertext,
        sa_iv: encrypted.iv,
        sa_tag: encrypted.tag,
      }),
    );
  }

  return encrypt(budget.currentAmount).map(
    (encrypted: { ciphertext: string; iv: string; tag: string }) => ({
      ...budget,
      currentAmount: encrypted.ciphertext,
      ca_iv: encrypted.iv,
      ca_tag: encrypted.tag,
    }),
  );
};
