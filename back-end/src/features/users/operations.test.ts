import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/lib/db/testUtils";
import * as UserOperations from "./operations";
import { UserAlreadyOnboardedError, UserAlreadyVerifiedError } from "./types";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";

describe("User Operations", () => {
  describe("createUser", () => {
    test("should create user successfully with valid data", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await UserOperations.createUser(
          {
            name: "John Doe",
            email: "john.doe@example.com",
          },
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const user = result.value;
          expect(user.name).toBe("John Doe");
          expect(user.email).toBe("john.doe@example.com");
          expect(user.emailVerified).toBe(false);
          expect(user.onboarded).toBe(false);
          expect(user.id).toBeTruthy();
        }
      });
    });

    test("should fail when email already exists", async () => {
      await withTestTransaction(async (ctx) => {
        const firstResult = await UserOperations.createUser(
          {
            name: "John Doe",
            email: "john@example.com",
          },
          ctx,
        );
        expect(firstResult.isOk()).toBe(true);

        const secondResult = await UserOperations.createUser(
          {
            name: "Jane Doe",
            email: "john@example.com",
          },
          ctx,
        );

        expect(secondResult.isErr()).toBe(true);
        if (secondResult.isErr()) {
          expect(secondResult.error).toBeInstanceOf(UserEmailAlreadyInUseError);
        }
      });
    });
  });

  describe("getAllUsers", () => {
    test("returns empty array when no users exist", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await UserOperations.getAllUsers(ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(Array.isArray(result.value)).toBe(true);
        }
      });
    });

    test("should return all created users", async () => {
      await withTestTransaction(async (ctx) => {
        await UserOperations.createUser(
          { name: "User 1", email: "user1@example.com" },
          ctx,
        );
        await UserOperations.createUser(
          { name: "User 2", email: "user2@example.com" },
          ctx,
        );

        const result = await UserOperations.getAllUsers(ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const users = result.value;
          expect(users.length).toBeGreaterThanOrEqual(2);
          const createdUsers = users.filter(
            (u) =>
              u.email === "user1@example.com" ||
              u.email === "user2@example.com",
          );
          expect(createdUsers.length).toBe(2);
        }
      });
    });
  });

  describe("markUserAsOnboarded", () => {
    test("should mark user as onboarded successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        expect(createResult.isOk()).toBe(true);
        const userId = createResult._unsafeUnwrap().id;

        const onboardResult = await UserOperations.markUserAsOnboarded(
          userId,
          ctx,
        );

        expect(onboardResult.isOk()).toBe(true);
        if (onboardResult.isOk()) {
          expect(onboardResult.value.onboarded).toBe(true);
        }
      });
    });

    test("should fail when user is already onboarded", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;
        await UserOperations.markUserAsOnboarded(userId, ctx);

        const secondOnboardResult = await UserOperations.markUserAsOnboarded(
          userId,
          ctx,
        );

        expect(secondOnboardResult.isErr()).toBe(true);
        if (secondOnboardResult.isErr()) {
          expect(secondOnboardResult.error).toBeInstanceOf(
            UserAlreadyOnboardedError,
          );
        }
      });
    });
  });

  describe("markUserAsVerified", () => {
    test("should mark user email as verified successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;

        const verifyResult = await UserOperations.markUserAsVerified(
          userId,
          ctx,
        );

        expect(verifyResult.isOk()).toBe(true);
        if (verifyResult.isOk()) {
          expect(verifyResult.value.emailVerified).toBe(true);
        }
      });
    });

    test("should fail when user is already verified", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;
        await UserOperations.markUserAsVerified(userId, ctx);

        const secondVerifyResult = await UserOperations.markUserAsVerified(
          userId,
          ctx,
        );

        expect(secondVerifyResult.isErr()).toBe(true);
        if (secondVerifyResult.isErr()) {
          expect(secondVerifyResult.error).toBeInstanceOf(
            UserAlreadyVerifiedError,
          );
        }
      });
    });
  });

  describe("updateUser", () => {
    test("should update user name successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;

        const updateResult = await UserOperations.updateUser(
          userId,
          { name: "Jane Doe" },
          ctx,
        );

        expect(updateResult.isOk()).toBe(true);
        if (updateResult.isOk()) {
          expect(updateResult.value.name).toBe("Jane Doe");
          expect(updateResult.value.email).toBe("john@example.com");
        }
      });
    });
  });

  describe("isUserFullySetup", () => {
    test("should return false for new user", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;

        const setupResult = await UserOperations.isUserFullySetup(userId, ctx);

        expect(setupResult.isOk()).toBe(true);
        if (setupResult.isOk()) {
          expect(setupResult.value).toBe(false);
        }
      });
    });

    test("should return true when user is onboarded and verified", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;
        await UserOperations.markUserAsOnboarded(userId, ctx);
        await UserOperations.markUserAsVerified(userId, ctx);

        const setupResult = await UserOperations.isUserFullySetup(userId, ctx);

        expect(setupResult.isOk()).toBe(true);
        if (setupResult.isOk()) {
          expect(setupResult.value).toBe(true);
        }
      });
    });

    test("should return false when only onboarded", async () => {
      await withTestTransaction(async (ctx) => {
        const createResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = createResult._unsafeUnwrap().id;
        await UserOperations.markUserAsOnboarded(userId, ctx);

        const setupResult = await UserOperations.isUserFullySetup(userId, ctx);

        expect(setupResult.isOk()).toBe(true);
        if (setupResult.isOk()) {
          expect(setupResult.value).toBe(false);
        }
      });
    });
  });
});
