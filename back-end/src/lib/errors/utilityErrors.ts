import { createError } from "../utils/createError";

export const InvalidDecimalNumberStringError = createError(
  "InvalidDecimalNumberString",
  () => "Invalid decimal number string",
  {
    code: "INVALID_DECIMAL_NUMBER_STRING",
    error: "Invalid Input",
    statusCode: 400,
  },
);

export const DivideByZeroError = createError(
  "DivideByZeroError",
  () => "Cannot devide by zero",
  {
    code: "DIVIDE_BY_ZERO",
    error: "Invalid Operation",
    statusCode: 400,
  },
);

export const PercentageCalculationError = createError(
  "PercentageCalculationError",
  (message) => message,
  {
    code: "PERCENTAGE_CALCULATION_ERROR",
    error: "Calculation Error",
    statusCode: 400,
  },
);
