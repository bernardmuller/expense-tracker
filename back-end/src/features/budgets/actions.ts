import { ResultAsync, okAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import {
  encrypt,
  decrypt,
  isEncrypted,
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const subtractFromBudgetCurrentAmount = (
  budget: Budget,
  transactionAmount: number,
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
        const newAmount = currentAmount - transactionAmount;

        return {
          ...budget,
          currentAmount: newAmount.toString(),
          updatedAt: new Date(),
        };
      });
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

const isNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const encryptBudgetAmounts = (
  budget: Budget,
): ResultAsync<
  Budget,
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> => {
  const shouldEncryptStart = isNumeric(budget.startAmount);
  const shouldEncryptCurrent = isNumeric(budget.currentAmount);

  if (!shouldEncryptStart && !shouldEncryptCurrent) {
    return okAsync(budget);
  }

  if (shouldEncryptStart && shouldEncryptCurrent) {
    return ResultAsync.fromPromise(
      encrypt(budget.startAmount),
      (error) =>
        error instanceof EncryptionCipherCreationError ||
        error instanceof EncryptionCipherUpdateError ||
        error instanceof EncryptionCipherFinalError
          ? error
          : new EncryptionCipherFinalError(),
    )
      .andThen((encryptResult) => encryptResult)
      .andThen((encryptedStart: { ciphertext: string; iv: string; tag: string }) => {
        return ResultAsync.fromPromise(
          encrypt(budget.currentAmount),
          (error) =>
            error instanceof EncryptionCipherCreationError ||
            error instanceof EncryptionCipherUpdateError ||
            error instanceof EncryptionCipherFinalError
              ? error
              : new EncryptionCipherFinalError(),
        )
          .andThen((encryptResult) => encryptResult)
          .map((encryptedCurrent: { ciphertext: string; iv: string; tag: string }) => ({
            ...budget,
            startAmount: encryptedStart.ciphertext,
            currentAmount: encryptedCurrent.ciphertext,
            sa_iv: encryptedStart.iv,
            sa_tag: encryptedStart.tag,
            ca_iv: encryptedCurrent.iv,
            ca_tag: encryptedCurrent.tag,
          }));
      });
  }

  if (shouldEncryptStart) {
    return ResultAsync.fromPromise(
      encrypt(budget.startAmount),
      (error) =>
        error instanceof EncryptionCipherCreationError ||
        error instanceof EncryptionCipherUpdateError ||
        error instanceof EncryptionCipherFinalError
          ? error
          : new EncryptionCipherFinalError(),
    )
      .andThen((encryptResult) => encryptResult)
      .map((encrypted: { ciphertext: string; iv: string; tag: string }) => ({
        ...budget,
        startAmount: encrypted.ciphertext,
        sa_iv: encrypted.iv,
        sa_tag: encrypted.tag,
      }));
  }

  return ResultAsync.fromPromise(
    encrypt(budget.currentAmount),
    (error) =>
      error instanceof EncryptionCipherCreationError ||
      error instanceof EncryptionCipherUpdateError ||
      error instanceof EncryptionCipherFinalError
        ? error
        : new EncryptionCipherFinalError(),
  )
    .andThen((encryptResult) => encryptResult)
    .map((encrypted: { ciphertext: string; iv: string; tag: string }) => ({
      ...budget,
      currentAmount: encrypted.ciphertext,
      ca_iv: encrypted.iv,
      ca_tag: encrypted.tag,
    }));
};
