import { err, ok } from "neverthrow";

const floatRegex = /^-?\d+(\.\d+)?$/;

export class InvalidDecimalNumberString extends Error {
  readonly _tag = "InvalidDecimalNumberString";
  constructor() {
    super("Invalid decimal number string");
    this.name = "InvalidDecimalNumberString";
  }
}

export const getNumberOfDecimalPlaces = (value: string) =>
  floatRegex.test(value)
    ? ok(value.split(".")[1]?.length ?? 0)
    : err(new InvalidDecimalNumberString());
