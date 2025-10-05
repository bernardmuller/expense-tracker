import { Data, Effect } from "effect";

export class DivideByZeroError extends Data.TaggedError(
  "DivideByZeroError",
)<{}> {}

export class PercentageCalculationError extends Data.TaggedError(
  "PercentageCalculationError",
)<{
  cause: unknown;
  message: string;
}> {}

export const calculatePercentage = (value: number, target: number) =>
  Effect.try({
    try: () => {
      if (target === 0) throw new DivideByZeroError();
      return ((value / target) * 100).toFixed(1);
    },
    catch: (error) =>
      new PercentageCalculationError({
        cause: error,
        message: "Failed to calculate percentage",
      }),
  });
