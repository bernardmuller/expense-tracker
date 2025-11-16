import type { UserValidationError } from "@/features/users/types";
import {
  DivideByZeroError,
  InvalidDecimalNumberStringError,
  PercentageCalculationError,
} from "./utilityErrors";
import { EmailSendError } from "./smtpErrors";

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
  | InstanceType<typeof EmailSendError>
  | TUnexpectedError;
