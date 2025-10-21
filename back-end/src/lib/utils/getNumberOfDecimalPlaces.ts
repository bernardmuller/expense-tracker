import { err, ok } from "neverthrow";
import { InvalidDecimalNumberStringError } from "../errors/utilityErrors";

const floatRegex = /^-?\d+(\.\d+)?$/;

export const getNumberOfDecimalPlaces = (value: string) =>
  floatRegex.test(value)
    ? ok(value.split(".")[1]?.length ?? 0)
    : err(new InvalidDecimalNumberStringError());
