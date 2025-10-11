import { err, ok } from "neverthrow";

export class DivideByZeroError extends Error {
  readonly _tag = "DivideByZeroError";
  constructor() {
    super("Cannot divide by zero");
    this.name = "DivideByZeroError";
  }
}

export class PercentageCalculationError extends Error {
  readonly _tag = "PercentageCalculationError";
  constructor(
    public cause: unknown,
    message: string,
  ) {
    super(message);
    this.name = "PercentageCalculationError";
  }
}

export const calculatePercentage = (value: number, target: number) => {
  try {
    if (target === 0) return err(new DivideByZeroError());
    return ok(((value / target) * 100).toFixed(1));
  } catch (error) {
    return err(
      new PercentageCalculationError(error, "Failed to calculate percentage"),
    );
  }
};
