import { err, ok } from "neverthrow";
import { ValidationError } from "../errors/domain";

export const calculatePercentage = (value: number, target: number) => {
  try {
    if (target === 0) {
      return err(new ValidationError("Cannot divide by zero"));
    }
    return ok(((value / target) * 100).toFixed(1));
  } catch (error) {
    return err(new ValidationError("Failed to calculate percentage"));
  }
};
