import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import {
  MissingRequiredFieldsError,
  CategoryAlreadySoftDeletedError,
  InvalidCategoryLabelError,
  InvalidCategoryKeyError,
} from "./categoryErrors";
import {
  createCategory,
  updateCategory,
  softDeleteCategory,
  isCategorySoftDeleted,
  type Category,
  type CreateCategoryParams,
  type UpdateCategoryParams,
} from "./index";
import { faker } from "@faker-js/faker";
import { generateUuid } from "@/lib/utils/generateUuid";
import {
  generateMockCategory,
  mockCategories,
} from "../__mocks__/category.mock";

describe("createCategory", () => {
  let mock: CreateCategoryParams;

  beforeEach(() => {
    mock = {
      key: faker.word.noun().toLowerCase(),
      label: faker.word.words(2),
      icon: faker.internet.emoji(),
    };
  });

  effectIt.effect("should create a category with the provided properties", () =>
    Effect.gen(function* () {
      const result = yield* createCategory(mock);
      expect(result.key).toBe(mock.key);
      expect(result.label).toBe(mock.label);
      expect(result.icon).toBe(mock.icon);
    }),
  );

  effectIt.effect("should create a category with an id", () =>
    Effect.gen(function* () {
      const result = yield* createCategory(mock);
      expect(result.id).toBeTruthy();
    }),
  );

  effectIt.effect("should create a category with no deletedAt property", () =>
    Effect.gen(function* () {
      const result = yield* createCategory(mock);
      expect(result.deletedAt).toBeFalsy();
    }),
  );

  effectIt.effect("should fail when key is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, key: "" };
      const result = yield* Effect.exit(createCategory(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );

  effectIt.effect("should fail when label is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, label: "" };
      const result = yield* Effect.exit(createCategory(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );

  effectIt.effect("should fail when icon is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, icon: "" };
      const result = yield* Effect.exit(createCategory(invalidMock));
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

describe("updateCategory", () => {
  effectIt.effect("should update the label of a category", () =>
    Effect.gen(function* () {
      const categories = mockCategories(5);
      for (const category of categories) {
        const newLabel = faker.word.words(3);
        const result = yield* updateCategory(category, { label: newLabel });
        expect(result.label).toBe(newLabel);
      }
    }),
  );

  effectIt.effect("should update the key of a category", () =>
    Effect.gen(function* () {
      const categories = mockCategories(5);
      for (const category of categories) {
        const newKey = faker.word.noun().toLowerCase();
        const result = yield* updateCategory(category, { key: newKey });
        expect(result.key).toBe(newKey);
      }
    }),
  );

  effectIt.effect("should update the icon of a category", () =>
    Effect.gen(function* () {
      const categories = mockCategories(5);
      for (const category of categories) {
        const newIcon = faker.internet.emoji();
        const result = yield* updateCategory(category, { icon: newIcon });
        expect(result.icon).toBe(newIcon);
      }
    }),
  );

  effectIt.effect("should update multiple fields at once", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const newLabel = faker.word.words(2);
      const newKey = faker.word.noun().toLowerCase();
      const newIcon = faker.internet.emoji();

      const result = yield* updateCategory(category, {
        label: newLabel,
        key: newKey,
        icon: newIcon,
      });
      expect(result.label).toBe(newLabel);
      expect(result.key).toBe(newKey);
      expect(result.icon).toBe(newIcon);
    }),
  );

  effectIt.effect("should timestamp the updatedAt property", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const newLabel = faker.word.words(2);
      const result = yield* updateCategory(category, { label: newLabel });
      expect(result.updatedAt).toBeTruthy();
    }),
  );

  effectIt.effect("should not modify fields that are not provided", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const originalKey = category.key;
      const originalIcon = category.icon;
      const newLabel = faker.word.words(2);

      const result = yield* updateCategory(category, { label: newLabel });
      expect(result.label).toBe(newLabel);
      expect(result.key).toBe(originalKey);
      expect(result.icon).toBe(originalIcon);
    }),
  );

  effectIt.effect("should fail when label is empty", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const result = yield* Effect.exit(
        updateCategory(category, { label: "" }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(InvalidCategoryLabelError);
        }
      }
    }),
  );

  effectIt.effect("should fail when label is only whitespace", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const result = yield* Effect.exit(
        updateCategory(category, { label: "   " }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(InvalidCategoryLabelError);
        }
      }
    }),
  );

  effectIt.effect("should fail when key is empty", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const result = yield* Effect.exit(updateCategory(category, { key: "" }));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(InvalidCategoryKeyError);
        }
      }
    }),
  );

  effectIt.effect("should fail when key is only whitespace", () =>
    Effect.gen(function* () {
      const category = generateMockCategory();
      const result = yield* Effect.exit(
        updateCategory(category, { key: "   " }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(InvalidCategoryKeyError);
        }
      }
    }),
  );
});

describe("softDeleteCategory", () => {
  effectIt.effect("should be marked as deleted", () =>
    Effect.gen(function* () {
      const categories = mockCategories(5);
      for (const category of categories) {
        category.deletedAt = undefined;
        const result = yield* softDeleteCategory(category);
        expect(result.deletedAt).toBeTruthy();
      }
    }),
  );

  effectIt.effect(
    "should not be able to soft delete a category that is already deleted",
    () =>
      Effect.gen(function* () {
        const category = generateMockCategory();
        category.deletedAt = faker.date.anytime().toISOString();
        const result = yield* Effect.exit(softDeleteCategory(category));
        expect(Exit.isFailure(result)).toBeTruthy();
        if (Exit.isFailure(result)) {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(
              CategoryAlreadySoftDeletedError,
            );
          }
        }
      }),
  );
});

describe("isCategorySoftDeleted", () => {
  effectIt.effect("should return true when category is deleted", () =>
    Effect.gen(function* () {
      const category = generateMockCategory({
        deletedAt: faker.date.anytime().toISOString(),
      });
      const result = isCategorySoftDeleted(category);
      expect(result).toBe(true);
    }),
  );

  effectIt.effect("should return false when category is not deleted", () =>
    Effect.gen(function* () {
      const category = generateMockCategory({
        deletedAt: undefined,
      });
      const result = isCategorySoftDeleted(category);
      expect(result).toBe(false);
    }),
  );
});
