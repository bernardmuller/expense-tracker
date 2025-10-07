import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import {
  MissingRequiredFieldsError,
  InvalidAllocatedAmountError,
} from "./categoryBudgetErrors";
import {
  createCategoryBudget,
  updateAllocatedAmount,
  isCategoryBudgetSoftDeleted,
  type CategoryBudget,
  type CreateCategoryBudgetParams,
} from "./index";
import { faker } from "@faker-js/faker";
import {
  generateMockCategoryBudget,
  mockCategoryBudgets,
} from "../__mocks__/categoryBudget.mock";

describe("createCategoryBudget", () => {
  let mock: CreateCategoryBudgetParams;

  beforeEach(() => {
    mock = {
      budgetId: faker.string.uuid(),
      categoryId: faker.string.uuid(),
      allocatedAmount: faker.number.float({ min: 0, max: 10000 }),
    };
  });

  effectIt.effect(
    "should create a categoryBudget with the provided properties",
    () =>
      Effect.gen(function* () {
        const result = yield* createCategoryBudget(mock);
        expect(result.budgetId).toBe(mock.budgetId);
        expect(result.categoryId).toBe(mock.categoryId);
        expect(result.allocatedAmount).toBe(mock.allocatedAmount);
      }),
  );

  effectIt.effect("should create a categoryBudget with an id", () =>
    Effect.gen(function* () {
      const result = yield* createCategoryBudget(mock);
      expect(result.id).toBeTruthy();
    }),
  );

  effectIt.effect("should fail when budgetId is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, budgetId: "" };
      const result = yield* Effect.exit(createCategoryBudget(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );

  effectIt.effect("should fail when categoryId is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, categoryId: "" };
      const result = yield* Effect.exit(createCategoryBudget(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );

  effectIt.effect("should fail when allocatedAmount is negative", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, allocatedAmount: -100 };
      const result = yield* Effect.exit(createCategoryBudget(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(
            InvalidAllocatedAmountError,
          );
        }
      }
    }),
  );
});

describe("updateAllocatedAmount", () => {
  effectIt.effect("should update the allocated amount", () =>
    Effect.gen(function* () {
      const categoryBudgets = mockCategoryBudgets(5);
      for (const categoryBudget of categoryBudgets) {
        const newAmount = faker.number.float({ min: 0, max: 10000 });
        const result = yield* updateAllocatedAmount(categoryBudget, newAmount);
        expect(result.allocatedAmount).toBe(newAmount);
      }
    }),
  );

  effectIt.effect("should fail when amount is negative", () =>
    Effect.gen(function* () {
      const categoryBudget = generateMockCategoryBudget();
      const result = yield* Effect.exit(
        updateAllocatedAmount(categoryBudget, -100),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(
            InvalidAllocatedAmountError,
          );
        }
      }
    }),
  );
});
