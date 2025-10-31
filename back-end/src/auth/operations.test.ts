import { describe, test, expect } from "vitest";
import { withTestTransaction } from "@/db/testUtils";
import * as AuthOperations from "./operations";
import * as HttpStatusCodes from "stoker/http-status-codes";

describe("Auth Operations", () => {
  describe("register", () => {
    test("should register a new user with valid data", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await AuthOperations.register(
          {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
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

    test("should error if email is already in use", async () => {
      await withTestTransaction(async (ctx) => {
        const result = await AuthOperations.register(
          {
            name: "Developer",
            email: "developer@email.com",
            password: "password123",
          },
          ctx,
        );

        expect(result.isOk()).toBe(false);
        if (!result.isOk()) {
          const error = result.error;
          expect(result.error.statusCode).toBe(
            HttpStatusCodes.UNPROCESSABLE_ENTITY,
          );
          expect(result.error.code).toBe("USER_EMAIL_ALREADY_IN_USE");
        }
      });
    });
  });
});
