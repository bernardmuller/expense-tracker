import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import { MissingRequiredFieldsError } from "./userCategoryErrors";
import { createUserCategory, type CreateUserCategoryParams } from "./index";
import { faker } from "@faker-js/faker";

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
