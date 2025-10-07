import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Cause, Effect, Exit } from "effect";
import {
  MissingRequiredFieldsError,
  InvalidStartAmountError,
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
} from "./budgetErrors";
import {
  addToBudgetCurrentAmount,
  createBudget,
  getBudgetSpentAmount,
  getBudgetSpentPercentage,
  isBudgetActive,
  isBudgetOverbudget,
  isBudgetSoftDeleted,
  setBudgetActive,
  setBudgetInactive,
  subtractFromBudgetCurrentAmount,
  updateBudgetName,
  type Budget,
  type CreateBudgetParams,
} from "./index";
import { faker } from "@faker-js/faker";
import { generateMockBudget, mockBudgets } from "../__mocks__/budget.mock";
import {
  calculatePercentage,
  PercentageCalculationError,
} from "@/lib/utils/calculatePercentage";
import { getNumberOfDecimalPlaces } from "@/lib/utils/getNumberOfDecimalPlaces";

describe("createBudget", () => {
  let mock: CreateBudgetParams;

  beforeEach(() => {
    mock = {
      name: faker.animal.cow(),
      startAmount: 10000,
      userId: faker.string.uuid(),
    };
  });

  effectIt.effect("should create a budget with the provided properties", () =>
    Effect.gen(function* () {
      const result = yield* createBudget(mock);
      expect(result.name).toBe(mock.name);
      expect(result.startAmount).toBe(mock.startAmount);
      expect(result.userId).toBe(mock.userId);
    }),
  );

  effectIt.effect(
    "should error with a list of fields if the create properties are not provided",
    () =>
      Effect.gen(function* () {
        //@ts-expect-error
        const result = yield* Effect.exit(createBudget({}));
        expect(Exit.isFailure(result)).toBe(true);
        if (Exit.isFailure(result)) {
          expect(result).toStrictEqual(
            Exit.fail(
              new MissingRequiredFieldsError({
                fields: ["userId", "name", "startAmount"],
              }),
            ),
          );
        }
      }),
  );

  effectIt.effect(
    "should error with InvalidStartAmountError if the start amount is negative",
    () =>
      Effect.gen(function* () {
        const result = yield* Effect.exit(
          createBudget({
            ...mock,
            startAmount: -100,
          }),
        );
        expect(Exit.isFailure(result)).toBe(true);
        if (Exit.isFailure(result)) {
          expect(result).toStrictEqual(
            Exit.fail(
              new InvalidStartAmountError({
                amount: -100,
              }),
            ),
          );
        }
      }),
  );

  effectIt.effect("should create a complete budget entity", () =>
    Effect.gen(function* () {
      const result = yield* createBudget(mock);
      expect(result).toHaveProperty("isActive");
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("currentAmount");
    }),
  );

  effectIt.effect("should set the currentAmount to the start amount", () =>
    Effect.gen(function* () {
      const result = yield* createBudget(mock);
      expect(result.currentAmount).toBe(mock.startAmount);
    }),
  );
});

describe("getBudgetSpentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  effectIt.effect("should calculate the total spent amount", () =>
    Effect.gen(function* () {
      const result = yield* getBudgetSpentAmount(mock);
      const expected = mock.startAmount - mock.currentAmount;
      expect(result).toBe(expected);
    }),
  );

  effectIt.effect("should throw if budget has no start or currentAmount", () =>
    Effect.gen(function* () {
      const result = yield* Effect.exit(
        getBudgetSpentAmount({
          ...mock,
          //@ts-expect-error: testing undefined edge-cases
          currentAmount: undefined,
          //@ts-expect-error: testing undefined edge-cases
          startAmount: undefined,
        }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(
          Exit.fail(
            new MissingRequiredFieldsError({
              fields: ["startAmount", "currentAmount"],
            }),
          ),
        );
      }
    }),
  );

  effectIt.effect("should handle currentAmount going into the negatives", () =>
    Effect.gen(function* () {
      const result = yield* getBudgetSpentAmount({
        ...mock,
        currentAmount: -200,
        startAmount: 1000,
      });
      expect(result).toBe(1200);
    }),
  );
});

describe("getBudgetSpentPercentage", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  effectIt.effect("should calculate the total spent percentage", () =>
    Effect.gen(function* () {
      const result = yield* getBudgetSpentPercentage(mock);
      const difference = mock.startAmount - mock.currentAmount;
      const expected = yield* calculatePercentage(difference, mock.startAmount);

      expect(result).toBe(expected);
    }),
  );

  effectIt.effect("should throw if budget has no start or currentAmount", () =>
    Effect.gen(function* () {
      const result = yield* Effect.exit(
        getBudgetSpentPercentage({
          ...mock,
          //@ts-expect-error: testing undefined edge-cases
          currentAmount: undefined,
          //@ts-expect-error: testing undefined edge-cases
          startAmount: undefined,
        }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(
          Exit.fail(
            new MissingRequiredFieldsError({
              fields: ["startAmount", "currentAmount"],
            }),
          ),
        );
      }
    }),
  );

  effectIt.effect("should calculate up to 1 decimals", () =>
    Effect.gen(function* () {
      const budgets = mockBudgets();
      for (const mock of budgets) {
        const result = yield* getBudgetSpentPercentage(mock);
        const decimalPlaces = yield* getNumberOfDecimalPlaces(result);
        expect(decimalPlaces).toBe(1);
      }
    }),
  );
});

describe("setBudgetActive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      isActive: false,
    });
  });

  effectIt.effect("should set the budget as active", () =>
    Effect.gen(function* () {
      const result = yield* setBudgetActive(mock);
      expect(result.isActive).toBe(true);
    }),
  );

  effectIt.effect("should throw if the budget is already active", () =>
    Effect.gen(function* () {
      mock.isActive = true;
      const result = yield* Effect.exit(setBudgetActive(mock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause).toEqual(
          Cause.fail(
            new BudgetAlreadyActiveError({
              budgetId: mock.id,
            }),
          ),
        );
      }
    }),
  );
});

describe("setBudgetInactive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      isActive: true,
    });
  });

  effectIt.effect("should set the budget as inactive", () =>
    Effect.gen(function* () {
      const result = yield* setBudgetInactive(mock);
      expect(result.isActive).toBe(false);
    }),
  );

  effectIt.effect("should throw if the budget is already inactive", () =>
    Effect.gen(function* () {
      mock.isActive = false;
      const result = yield* Effect.exit(setBudgetInactive(mock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(
          Exit.fail(
            new BudgetAlreadyInActiveError({
              budgetId: mock.id,
            }),
          ),
        );
      }
    }),
  );
});

describe("isBudgetActive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  effectIt.effect("should return true if budget is active", () =>
    Effect.gen(function* () {
      mock.isActive = true;
      const result = isBudgetActive(mock);
      expect(result).toBe(true);
    }),
  );

  effectIt.effect("should return false if budget is not active", () =>
    Effect.gen(function* () {
      mock.isActive = false;
      const result = isBudgetActive(mock);
      expect(result).toBe(false);
    }),
  );
});

describe("isBudgetOverbudget", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  effectIt.effect("should return true if current amount is negative", () =>
    Effect.gen(function* () {
      mock.currentAmount = -100;
      const result = isBudgetOverbudget(mock);
      expect(result).toBe(true);
    }),
  );

  effectIt.effect("should return false if current amount is positive", () =>
    Effect.gen(function* () {
      mock.currentAmount = 100;
      const result = isBudgetOverbudget(mock);
      expect(result).toBe(false);
    }),
  );

  effectIt.effect("should return false if current amount is zero", () =>
    Effect.gen(function* () {
      mock.currentAmount = 0;
      const result = isBudgetOverbudget(mock);
      expect(result).toBe(false);
    }),
  );
});

describe("updateBudgetName", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  effectIt.effect("should update the name of the budget", () =>
    Effect.gen(function* () {
      const newName = faker.animal.cow();
      const result = yield* Effect.exit(updateBudgetName(mock, newName));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.name).toBe(newName);
      }
    }),
  );
});

describe("addToBudgetCurrentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      currentAmount: 1000,
    });
  });

  effectIt.effect("should add to the current amount", () =>
    Effect.gen(function* () {
      const amountToAdd = 500;
      const result = yield* addToBudgetCurrentAmount(mock, amountToAdd);
      expect(result.currentAmount).toBe(1500);
    }),
  );
});

describe("subtractFromBudgetCurrentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      currentAmount: 1000,
    });
  });

  effectIt.effect("should subtract from the current amount", () =>
    Effect.gen(function* () {
      const amountToSubtract = 300;
      const result = yield* subtractFromBudgetCurrentAmount(
        mock,
        amountToSubtract,
      );
      expect(result.currentAmount).toBe(700);
    }),
  );
});
