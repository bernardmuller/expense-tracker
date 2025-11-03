import type { UserValidationError } from "@/users/types";
import {
  DivideByZeroError,
  InvalidDecimalNumberStringError,
  PercentageCalculationError,
} from "./utilityErrors";

export class UnexpectedError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "UnexpectedError";
  }
}

export type TUnexpectedError = InstanceType<typeof UnexpectedError>;

export type ApplicationError =
  | UserValidationError
  | InstanceType<typeof InvalidDecimalNumberStringError>
  | InstanceType<typeof DivideByZeroError>
  | InstanceType<typeof PercentageCalculationError>
  | TUnexpectedError;
