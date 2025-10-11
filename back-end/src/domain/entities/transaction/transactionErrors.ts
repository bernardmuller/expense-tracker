export class InvalidTransactionUpdateError extends Error {
  readonly _tag = "InvalidTransactionUpdateError";
  constructor(public reason: string) {
    super(`Invalid transaction update: ${reason}`);
    this.name = "InvalidTransactionUpdateError";
  }
}

export type TransactionError = InvalidTransactionUpdateError;
