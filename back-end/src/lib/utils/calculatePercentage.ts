import { err, ok } from "neverthrow";
import {
  DivideByZeroError,
  PercentageCalculationError,
} from "../errors/utilityErrors";

export const calculatePercentage = (value: number, target: number) => {
  try {
    if (target === 0) return err(new DivideByZeroError());
    return ok(((value / target) * 100).toFixed(1));
  } catch (error) {
    return err(
      new PercentageCalculationError("Failed to calculate percentage"),
    );
  }
};
