import { err, ok, Ok, Result } from "neverthrow";
import { ValidationError } from "../errors/domain";

const coerceUnknown = (
  value: unknown,
): Result<string | boolean | number, ValidationError> => {
  if (typeof value !== "string") {
    return err(new ValidationError("Value is not a string"));
  }
  if (value === "true") return ok(true);
  if (value === "false") return ok(false);
  const num = Number(value);
  if (!isNaN(num) && value !== "") return ok(num);
  return ok(value);
};

export default coerceUnknown;
