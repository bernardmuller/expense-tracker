import { ResultAsync, okAsync } from "neverthrow";
import type { Budget } from "@/lib/db/schema";
import {
  encrypt,
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
} from "@/lib/utils/encryption";

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
