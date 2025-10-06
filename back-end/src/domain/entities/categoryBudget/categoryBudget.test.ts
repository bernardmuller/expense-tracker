import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import {
  MissingRequiredFieldsError,
  CategoryBudgetAlreadySoftDeletedError,
  InvalidAllocatedAmountError,
} from "./categoryBudgetErrors";
import {
  createCategoryBudget,
  updateAllocatedAmount,
  softDeleteCategoryBudget,
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

  effectIt.effect("should create a categoryBudget with the provided properties", () =>
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

  effectIt.effect("should create a categoryBudget with no deletedAt property", () =>
    Effect.gen(function* () {
      const result = yield* createCategoryBudget(mock);
      expect(result.deletedAt).toBeFalsy();
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
          expect(result.cause.error).toBeInstanceOf(InvalidAllocatedAmountError);
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

  effectIt.effect("should timestamp the updatedAt property", () =>
    Effect.gen(function* () {
      const categoryBudget = generateMockCategoryBudget();
      const newAmount = faker.number.float({ min: 0, max: 10000 });
      const result = yield* updateAllocatedAmount(categoryBudget, newAmount);
      expect(result.updatedAt).toBeTruthy();
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
          expect(result.cause.error).toBeInstanceOf(InvalidAllocatedAmountError);
        }
      }
    }),
  );
});

describe("softDeleteCategoryBudget", () => {
  effectIt.effect("should be marked as deleted", () =>
    Effect.gen(function* () {
      const categoryBudgets = mockCategoryBudgets(5);
      for (const categoryBudget of categoryBudgets) {
        categoryBudget.deletedAt = undefined;
        const result = yield* softDeleteCategoryBudget(categoryBudget);
        expect(result.deletedAt).toBeTruthy();
      }
    }),
  );

  effectIt.effect(
    "should not be able to soft delete a categoryBudget that is already deleted",
    () =>
      Effect.gen(function* () {
        const categoryBudget = generateMockCategoryBudget();
        categoryBudget.deletedAt = faker.date.anytime().toISOString();
        const result = yield* Effect.exit(
          softDeleteCategoryBudget(categoryBudget),
        );
        expect(Exit.isFailure(result)).toBeTruthy();
        if (Exit.isFailure(result)) {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(
              CategoryBudgetAlreadySoftDeletedError,
            );
          }
        }
      }),
  );
});

describe("isCategoryBudgetSoftDeleted", () => {
  effectIt.effect("should return true when categoryBudget is deleted", () =>
    Effect.gen(function* () {
      const categoryBudget = generateMockCategoryBudget({
        deletedAt: faker.date.anytime().toISOString(),
      });
      const result = isCategoryBudgetSoftDeleted(categoryBudget);
      expect(result).toBe(true);
    }),
  );

  effectIt.effect("should return false when categoryBudget is not deleted", () =>
    Effect.gen(function* () {
      const categoryBudget = generateMockCategoryBudget({
        deletedAt: undefined,
      });
      const result = isCategoryBudgetSoftDeleted(categoryBudget);
      expect(result).toBe(false);
    }),
  );
});
