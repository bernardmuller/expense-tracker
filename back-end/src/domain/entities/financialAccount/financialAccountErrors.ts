export class MissingRequiredFieldsError extends Error {
  readonly _tag = "MissingRequiredFieldsError";
  constructor(public fields: string[]) {
    super(`Missing required fields: ${fields.join(", ")}`);
    this.name = "MissingRequiredFieldsError";
  }
}

export class InvalidFinancialAccountNameError extends Error {
  readonly _tag = "InvalidFinancialAccountNameError";
  constructor(public accountName: string) {
    super(`Invalid financial account name: ${accountName}`);
    this.name = "InvalidFinancialAccountNameError";
  }
}

export class InvalidCurrentAmountError extends Error {
  readonly _tag = "InvalidCurrentAmountError";
  constructor(public amount: number) {
    super(`Invalid current amount: ${amount}`);
    this.name = "InvalidCurrentAmountError";
  }
}

export class FinancialAccountTypeAlreadySetError extends Error {
  readonly _tag = "FinancialAccountTypeAlreadySetError";
  constructor(public type: string) {
    super(`Financial account type is already set: ${type}`);
    this.name = "FinancialAccountTypeAlreadySetError";
  }
}

export class InvalidSubtractionAmountError extends Error {
  readonly _tag = "InvalidSubtractionAmountError";
  constructor(public amount: number) {
    super(`Invalid subtraction amount: ${amount}`);
    this.name = "InvalidSubtractionAmountError";
  }
}

export class InvalidAdditionAmountError extends Error {
  readonly _tag = "InvalidAdditionAmountError";
  constructor(public amount: number) {
    super(`Invalid addition amount: ${amount}`);
    this.name = "InvalidAdditionAmountError";
  }
}

export type FinancialAccountValidationError =
  | InvalidFinancialAccountNameError
  | FinancialAccountTypeAlreadySetError
  | InvalidAdditionAmountError
  | InvalidSubtractionAmountError
  | InvalidCurrentAmountError;
