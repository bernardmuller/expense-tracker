import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import { AlreadyDeletedError, ValidationError } from "@/lib/errors";
import { createBudget, getBudgetSpentAmount, type Budget, type CreateBudgetParams } from "./budget";
import { transactionType } from "./types/TransactionType";
import { faker } from "@faker-js/faker";
import { generateUuid } from "@/lib/utils/generateUuid";
import {
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
        expect(result).toStrictEqual(Exit.fail(new ValidationError({ message: "" })))
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



