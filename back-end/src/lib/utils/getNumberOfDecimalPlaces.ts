import { Data, Effect } from "effect";

const floatRegex = /^-?\d+(\.\d+)?$/;

export class InvalidDecimalNumberString extends Data.TaggedError(
  "InvalidDecimalNumberString",
)<{}> {}

export const getNumberOfDecimalPlaces = (value: string) =>
  floatRegex.test(value)
    ? Effect.succeed(value.split(".")[1]?.length ?? 0)
    : Effect.fail(new InvalidDecimalNumberString());
