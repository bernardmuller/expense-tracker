import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import { AlreadyDeletedError, ValidationError } from "@/lib/errors";
import { createBudget, getBudgetSpentAmount, getBudgetSpentPercentage, isBudgetActive, setBudgetActive, type Budget, type CreateBudgetParams } from "./budget";
import { transactionType } from "./types/TransactionType";
import { faker } from "@faker-js/faker";
import { generateUuid } from "@/lib/utils/generateUuid";
import {
  generateMockBudget,
  mockBudgets
} from "./__mocks__/budget.mock.js";


describe("createBudget", () => {
  let mock: CreateBudgetParams;

  beforeEach(() => {
    mock = {
      name: faker.animal.cow(),
      startAmount: 10000,
      userId: faker.string.uuid()
    };
  });

  effectIt.effect("should create a budget with the provided properties", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createBudget(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.name).toBe(mock.name);
        expect(result.value.startAmount).toBe(mock.startAmount);
        expect(result.value.userId).toBe(mock.userId);
      }
    })
  );

  effectIt.effect("should error if the create properties are not provided", () =>
    Effect.gen(function*() {
      //@ts-expect-error
      const result = yield* Effect.exit(createBudget({}));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(Exit.fail(new ValidationError({})))
      }
    })
  );

  effectIt.effect("should create a complete budget entity", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createBudget(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value).toHaveProperty("isActive")
        expect(result.value).toHaveProperty("id")
        expect(result.value).toHaveProperty("currentAmount")
        expect(result.value).toHaveProperty("deletedAt")
        expect(result.value).toHaveProperty("updatedAt")
      }
    })
  );

  effectIt.effect("should set the currentAmount to the start amount", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createBudget(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.currentAmount).toBe(mock.startAmount)
      }
    })
  );
})

describe("getBudgetSpentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    const randomStartAmount = faker.number.int({ min: 1, max: 10000 });
    const randomCurrentAmount = faker.number.int({ min: 1, max: 10000 });
    mock = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      name: faker.animal.cow(),
      startAmount: randomStartAmount,
      currentAmount: randomCurrentAmount,
      isActive: true,
    };
  });

  effectIt.effect("should calculate the total spent amount", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(getBudgetSpentAmount(mock));
      const expected = mock.startAmount - mock.currentAmount;
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value).toBe(expected);
      }
    })
  );

  effectIt.effect("should throw if budget has no start or currentAmount", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(getBudgetSpentAmount({
        ...mock,
        //@ts-expect-error: testing undefined edge-cases
        currentAmount: undefined,
        //@ts-expect-error: testing undefined edge-cases
        startAmount: undefined
      }));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(Exit.fail(new ValidationError({ message: "" })));
      }
    })
  );
})

describe("getBudgetSpentPercentage", () => {
  let mock: Budget;

  beforeEach(() => {
    const randomStartAmount = faker.number.int({ min: 1, max: 10000 });
    const randomCurrentAmount = faker.number.int({ min: 1, max: 10000 });
    mock = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      name: faker.animal.cow(),
      startAmount: randomStartAmount,
      currentAmount: randomCurrentAmount,
      isActive: true,
    };
  });

  effectIt.effect("should calculate the total spent percentage", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(getBudgetSpentPercentage(mock));
      const expected = ((mock.startAmount - mock.currentAmount) / mock.startAmount * 100).toFixed(1);
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value).toBe(expected);
      }
    })
  );

  effectIt.effect("should throw if budget has no start or currentAmount", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(getBudgetSpentPercentage({
        ...mock,
        //@ts-expect-error: testing undefined edge-cases
        currentAmount: undefined,
        //@ts-expect-error: testing undefined edge-cases
        startAmount: undefined
      }));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(Exit.fail(new ValidationError({})));
      }
    })
  );

  effectIt.effect("should calculate up to 1 decimals", () =>
    Effect.gen(function*() {
      const budgets = mockBudgets()
      for (const mock of budgets) {
        const result = yield* Effect.exit(getBudgetSpentPercentage(mock));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          const decimalPlaces = result.value.split('.')[1]?.length || 1
          expect(decimalPlaces).toBe(1)
        }
      }
    })
  );
})

describe("setBudgetActive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
    mock.isActive = false;
  });

  effectIt.effect("should set the budget as active", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(setBudgetActive(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.isActive).toBe(true);
      }
    })
  );

  effectIt.effect("should throw if the budget is already active", () =>
    Effect.gen(function*() {
      mock.isActive = true
      const result = yield* Effect.exit(setBudgetActive(mock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result).toStrictEqual(Exit.fail(new ValidationError({
          entityId: mock.id,
        })));
      }
    })
  );
})

describe("isBudgetActive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  effectIt.effect("should return true if budget is active", () =>
    Effect.gen(function*() {
      mock.isActive = true;
      const result = yield* Effect.exit(isBudgetActive(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value).toBe(true);
      }
    })
  );

  effectIt.effect("should return false if budget is not active", () =>
    Effect.gen(function*() {
      mock.isActive = false
      const result = yield* Effect.exit(isBudgetActive(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value).toBe(false);
      }
    })
  );
})

