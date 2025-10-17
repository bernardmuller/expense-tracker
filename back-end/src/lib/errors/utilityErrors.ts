import { createError } from "../utils/createError";

export const InvalidDecimalNumberStringError = createError(
  "InvalidDecimalNumberString",
  () => "Invalid decimal number string",
);

export const DivideByZeroError = createError(
  "DivideByZeroError",
  () => "Cannot devide by zero",
);

export const PercentageCalculationError = createError(
  "PercentageCalculationError",
  (message) => message,
);
