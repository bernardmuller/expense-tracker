import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/db/testUtils";
import * as AccountOperations from "./operations";
import * as UserOperations from "@/users/operations";
import { AccountAlreadyExistsError } from "./types";

describe("Account Operations", () => {
  describe("createAccount", () => {
    test("should create account successfully with valid data", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          {
            name: "John Doe",
            email: "john.doe@example.com",
          },
          ctx,
        );
        expect(userResult.isOk()).toBe(true);
        const userId = userResult._unsafeUnwrap().id;

        const result = await AccountOperations.createAccount(
          {
            userId,
            password: "hashed_password_123",
          },
          ctx,
        );

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const account = result.value;
          expect(account.userId).toBe(userId);
          expect(account.password).toBe("hashed_password_123");
          expect(account.accessToken).toBe(null);
          expect(account.refreshToken).toBe(null);
          expect(account.id).toBeTruthy();
        }
      });
    });

    test("should fail when user already has an account", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          {
            name: "John Doe",
            email: "john@example.com",
          },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const firstResult = await AccountOperations.createAccount(
          {
            userId,
            password: "password1",
          },
          ctx,
        );
        expect(firstResult.isOk()).toBe(true);

        const secondResult = await AccountOperations.createAccount(
          {
            userId,
            password: "password2",
          },
          ctx,
        );

        expect(secondResult.isErr()).toBe(true);
        if (secondResult.isErr()) {
          expect(secondResult.error).toBeInstanceOf(AccountAlreadyExistsError);
        }
      });
    });
  });

  describe("getAccountById", () => {
    test("should get account by id", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          {
            name: "Jane Doe",
            email: "jane@example.com",
          },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        const createResult = await AccountOperations.createAccount(
          {
            userId,
            password: "password",
          },
          ctx,
        );
        const accountId = createResult._unsafeUnwrap().id;

        const result = await AccountOperations.getAccountById(accountId, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.id).toBe(accountId);
          expect(result.value.userId).toBe(userId);
        }
      });
    });

    test("should return error when account not found", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await AccountOperations.getAccountById(
          "non-existent-id",
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe("getAccountByUserId", () => {
    test("should get account by userId", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          {
            name: "Test User",
            email: "test@example.com",
          },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;

        await AccountOperations.createAccount(
          {
            userId,
            password: "password",
          },
          ctx,
        );

        const result = await AccountOperations.getAccountByUserId(userId, ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value.userId).toBe(userId);
        }
      });
    });

    test("should return error when account not found", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await AccountOperations.getAccountByUserId(
          "non-existent-user-id",
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });
  });

  describe("getAllAccounts", () => {
    test("returns empty array when no accounts exist", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await AccountOperations.getAllAccounts(ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(Array.isArray(result.value)).toBe(true);
        }
      });
    });

    test("should return all created accounts", async () => {
      await withTestTransaction(async (ctx) => {
        const user1Result = await UserOperations.createUser(
          { name: "User 1", email: "user1@example.com" },
          ctx,
        );
        const user2Result = await UserOperations.createUser(
          { name: "User 2", email: "user2@example.com" },
          ctx,
        );

        await AccountOperations.createAccount(
          {
            userId: user1Result._unsafeUnwrap().id,
            password: "password1",
          },
          ctx,
        );
        await AccountOperations.createAccount(
          {
            userId: user2Result._unsafeUnwrap().id,
            password: "password2",
          },
          ctx,
        );

        const result = await AccountOperations.getAllAccounts(ctx);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const accounts = result.value;
          expect(accounts.length).toBeGreaterThanOrEqual(2);
          const createdAccounts = accounts.filter(
            (a) =>
              a.userId === user1Result._unsafeUnwrap().id ||
              a.userId === user2Result._unsafeUnwrap().id,
          );
          expect(createdAccounts.length).toBe(2);
        }
      });
    });
  });

  describe("updateAccount", () => {
    test("should update account password successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "John Doe", email: "john@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;
        const createResult = await AccountOperations.createAccount(
          { userId, password: "old_password" },
          ctx,
        );
        const accountId = createResult._unsafeUnwrap().id;

        const updateResult = await AccountOperations.updateAccount(
          accountId,
          { password: "new_password" },
          ctx,
        );

        expect(updateResult.isOk()).toBe(true);
        if (updateResult.isOk()) {
          expect(updateResult.value.password).toBe("new_password");
          expect(updateResult.value.userId).toBe(userId);
        }
      });
    });

    test("should update account tokens successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Jane Doe", email: "jane@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;
        const createResult = await AccountOperations.createAccount(
          { userId, password: "password" },
          ctx,
        );
        const accountId = createResult._unsafeUnwrap().id;

        const updateResult = await AccountOperations.updateAccount(
          accountId,
          {
            accessToken: "new_access_token",
            refreshToken: "new_refresh_token",
            idToken: "new_id_token",
            scope: "read write",
          },
          ctx,
        );

        expect(updateResult.isOk()).toBe(true);
        if (updateResult.isOk()) {
          expect(updateResult.value.accessToken).toBe("new_access_token");
          expect(updateResult.value.refreshToken).toBe("new_refresh_token");
          expect(updateResult.value.idToken).toBe("new_id_token");
          expect(updateResult.value.scope).toBe("read write");
        }
      });
    });
  });

  describe("updatePassword", () => {
    test("should update password specifically", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Test User", email: "test@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;
        const createResult = await AccountOperations.createAccount(
          { userId, password: "old_password" },
          ctx,
        );
        const accountId = createResult._unsafeUnwrap().id;

        const updateResult = await AccountOperations.updatePassword(
          accountId,
          "super_secure_password",
          ctx,
        );

        expect(updateResult.isOk()).toBe(true);
        if (updateResult.isOk()) {
          expect(updateResult.value.password).toBe("super_secure_password");
          expect(updateResult.value.userId).toBe(userId);
        }
      });
    });
  });

  describe("deleteAccount", () => {
    test("should delete account successfully", async () => {
      await withTestTransaction(async (ctx) => {
        const userResult = await UserOperations.createUser(
          { name: "Delete Me", email: "delete@example.com" },
          ctx,
        );
        const userId = userResult._unsafeUnwrap().id;
        const createResult = await AccountOperations.createAccount(
          { userId, password: "password" },
          ctx,
        );
        const accountId = createResult._unsafeUnwrap().id;

        const deleteResult = await AccountOperations.deleteAccount(
          accountId,
          ctx,
        );

        expect(deleteResult.isOk()).toBe(true);

        const getResult = await AccountOperations.getAccountById(
          accountId,
          ctx,
        );
        expect(getResult.isErr()).toBe(true);
      });
    });

    test("should return error when trying to delete non-existent account", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await AccountOperations.deleteAccount(
          "non-existent-id",
          ctx,
        );

        expect(result.isErr()).toBe(true);
      });
    });
  });
});
