import { ResultAsync, Result } from "neverthrow";
import type { DomainError } from "./errors/domain";
import { DatabaseError, EncryptionError } from "./errors/domain";

export type AppResult<T, E extends DomainError = DomainError> = ResultAsync<
  T,
  E
>;
export type AppResultSync<T, E extends DomainError = DomainError> = Result<
  T,
  E
>;

export const success = <T>(value: T): AppResult<T, never> =>
  ResultAsync.fromSafePromise(Promise.resolve(value));

export const failure = <E extends DomainError>(error: E): AppResult<never, E> =>
  ResultAsync.fromPromise(Promise.reject(error), () => error);

export const fromDB = <T>(promise: Promise<T>): AppResult<T, DatabaseError> =>
  ResultAsync.fromPromise(promise, (err) => {
    console.error('Raw DB error:', err);
    return new DatabaseError(String(err));
  });

export const fromEncryption = <T>(
  promise: Promise<T>,
): AppResult<T, EncryptionError> =>
  ResultAsync.fromPromise(promise, (err) => new EncryptionError(String(err)));
