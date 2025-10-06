import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import {
  MissingRequiredFieldsError,
  UserCategoryAlreadySoftDeletedError,
} from "./userCategoryErrors";
import {
  createUserCategory,
  softDeleteUserCategory,
  isUserCategorySoftDeleted,
  type UserCategory,
  type CreateUserCategoryParams,
} from "./index";
import { faker } from "@faker-js/faker";
import {
  generateMockUserCategory,
  mockUserCategories,
} from "../__mocks__/userCategory.mock";

describe("createUserCategory", () => {
  let mock: CreateUserCategoryParams;

  beforeEach(() => {
    mock = {
      userId: faker.string.uuid(),
      categoryId: faker.string.uuid(),
    };
  });

  effectIt.effect(
    "should create a userCategory with the provided properties",
    () =>
      Effect.gen(function* () {
        const result = yield* createUserCategory(mock);
        expect(result.userId).toBe(mock.userId);
        expect(result.categoryId).toBe(mock.categoryId);
      }),
  );

  effectIt.effect("should create a userCategory with an id", () =>
    Effect.gen(function* () {
      const result = yield* createUserCategory(mock);
      expect(result.id).toBeTruthy();
    }),
  );

  effectIt.effect(
    "should create a userCategory with no deletedAt property",
    () =>
      Effect.gen(function* () {
        const result = yield* createUserCategory(mock);
        expect(result.deletedAt).toBeFalsy();
      }),
  );

  effectIt.effect("should fail when userId is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, userId: "" };
      const result = yield* Effect.exit(createUserCategory(invalidMock));
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
      const result = yield* Effect.exit(createUserCategory(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );
});

describe("softDeleteUserCategory", () => {
  effectIt.effect("should be marked as deleted", () =>
    Effect.gen(function* () {
      const userCategories = mockUserCategories(5);
      for (const userCategory of userCategories) {
        userCategory.deletedAt = undefined;
        const result = yield* softDeleteUserCategory(userCategory);
        expect(result.deletedAt).toBeTruthy();
      }
    }),
  );

  effectIt.effect(
    "should not be able to soft delete a userCategory that is already deleted",
    () =>
      Effect.gen(function* () {
        const userCategory = generateMockUserCategory();
        userCategory.deletedAt = faker.date.anytime().toISOString();
        const result = yield* Effect.exit(softDeleteUserCategory(userCategory));
        expect(Exit.isFailure(result)).toBeTruthy();
        if (Exit.isFailure(result)) {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(
              UserCategoryAlreadySoftDeletedError,
            );
          }
        }
      }),
  );
});

describe("isUserCategorySoftDeleted", () => {
  effectIt.effect("should return true when userCategory is deleted", () =>
    Effect.gen(function* () {
      const userCategory = generateMockUserCategory({
        deletedAt: faker.date.anytime().toISOString(),
      });
      const result = isUserCategorySoftDeleted(userCategory);
      expect(result).toBe(true);
    }),
  );

  effectIt.effect("should return false when userCategory is not deleted", () =>
    Effect.gen(function* () {
      const userCategory = generateMockUserCategory({
        deletedAt: undefined,
      });
      const result = isUserCategorySoftDeleted(userCategory);
      expect(result).toBe(false);
    }),
  );
});
