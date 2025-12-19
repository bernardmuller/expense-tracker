import { err, ok, Ok, Result } from "neverthrow";
import { CoercionError } from "../errors/utilityErrors";

const coerceUnknown = (
  value: unknown,
): Result<string | boolean | number, InstanceType<typeof CoercionError>> => {
  if (typeof value !== "string")
    return err(new CoercionError(": not a string"));
  if (value === "true") return ok(true);
  if (value === "false") return ok(false);
  const num = Number(value);
  if (!isNaN(num) && value !== "") return ok(num);
  return ok(value);
};

export default coerceUnknown;
