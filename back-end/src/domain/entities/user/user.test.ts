import { describe, it, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import {
  markUserAsOnboarded,
  markUserAsVerified,
  updateUserProfile,
  isUserFullySetup,
  softDeleteUser,
  type User,
} from "@/domain/entities/user";
import { mockUsers, generateMockUser } from "../__mocks__/user.mock";
import { Effect, Exit } from "effect";
import {
  UserAlreadySoftDeletedError,
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "./userErrors";

describe("markUserAsOnboarded", () => {
  effectIt.effect("should mark the user as onboarded", () =>
    Effect.gen(function* () {
      const users = mockUsers(5);

      for (const user of users) {
        user.onboarded = false;
        const result = yield* Effect.exit(markUserAsOnboarded(user));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.onboarded).toEqual(true);
        }
      }
    }),
  );

  effectIt.effect("should fail if user is already onboarded", () =>
    Effect.gen(function* () {
      const user = generateMockUser();
      user.onboarded = true;
      const result = yield* Effect.exit(markUserAsOnboarded(user));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(UserAlreadyOnboardedError);
        }
      }
    }),
  );
});

describe("markUserAsVerified", () => {
  effectIt.effect("should mark the user as verified", () =>
    Effect.gen(function* () {
      const users = mockUsers(5);

      for (const user of users) {
        user.emailVerified = false;
        const result = yield* Effect.exit(markUserAsVerified(user));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.emailVerified).toEqual(true);
        }
      }
    }),
  );

  effectIt.effect("should fail if user is already verified", () =>
    Effect.gen(function* () {
      const user = generateMockUser();
      user.emailVerified = true;
      const result = yield* Effect.exit(markUserAsVerified(user));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(UserAlreadyVerifiedError);
        }
      }
    }),
  );
});

describe("updateUserProfile", () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      id: "47d2aada-ac9d-4353-a95a-8dcea2aeb96f",
      name: "John Doe",
      email: "john@email.com",
      emailVerified: false,
      onboarded: true,
    };
  });

  effectIt.effect("should update user name", () =>
    Effect.gen(function* () {
      const params = {
        ...mockUser,
        name: "Jane Doe",
      };

      const result = yield* Effect.exit(updateUserProfile(mockUser, params));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.name).toEqual(params.name);
      }
    }),
  );

  effectIt.effect("should not update user email", () =>
    Effect.gen(function* () {
      const params = {
        ...mockUser,
        email: "shouldnotwork@email.com",
      };

      const result = yield* Effect.exit(updateUserProfile(mockUser, params));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.email).toEqual(mockUser.email);
      }
    }),
  );

  effectIt.effect("should not update any properties other than user name", () =>
    Effect.gen(function* () {
      const params = generateMockUser();
      const result = yield* Effect.exit(updateUserProfile(mockUser, params));

      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.email).toEqual(mockUser.email);
        expect(result.value.name).toEqual(params.name);
        expect(result.value.emailVerified).toEqual(mockUser.emailVerified);
        expect(result.value.onboarded).toEqual(mockUser.onboarded);
        expect(result.value.id).toEqual(mockUser.id);
      }
    }),
  );
});

describe("isUserFullySetup", () => {
  it("should return true if user is verified and onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = true;
    mock.onboarded = true;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(true);
  });

  it("should return false if user is not verified and not onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = false;
    mock.onboarded = false;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(false);
  });

  it("should return false if user is verified and not onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = true;
    mock.onboarded = false;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(false);
  });

  it("should return false if user is not verified and onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = false;
    mock.onboarded = true;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(false);
  });
});

describe("softDeleteUser", () => {
  effectIt.effect("should be marked as deleted", () =>
    Effect.gen(function* () {
      const user = generateMockUser();
      user.deletedAt = undefined;
      const result = yield* Effect.exit(softDeleteUser(user));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.deletedAt).toBeTruthy();
      }
    }),
  );

  effectIt.effect(
    "should not be able to soft delete as user that is already deleted",
    () =>
      Effect.gen(function* () {
        const user = generateMockUser();
        user.deletedAt = new Date().toLocaleString();
        const result = yield* Effect.exit(softDeleteUser(user));
        expect(Exit.isFailure(result)).toBeTruthy();
        if (Exit.isFailure(result)) {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(
              UserAlreadySoftDeletedError,
            );
          }
        }
      }),
  );
});
