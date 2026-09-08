import { err, ok } from "neverthrow";
import { ValidationError } from "../errors/domain";

const floatRegex = /^-?\d+(\.\d+)?$/;

export const getNumberOfDecimalPlaces = (value: string) =>
  floatRegex.test(value)
    ? ok(value.split(".")[1]?.length ?? 0)
    : err(new ValidationError("Invalid decimal number string"));
