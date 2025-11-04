import { createError } from "@/lib/utils/createError";
import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { accounts } from "@/db/schema";

// --------------------------------
// Schemas & Types
// --------------------------------

export const accountInsertSchema = createInsertSchema(accounts);
export const accountSchema = createSelectSchema(accounts);

export type Account = z.infer<typeof accountSchema>;

export const createAccountSchema = accountSchema.pick({
  userId: true,
});

export type CreateAccountParams = z.infer<typeof createAccountSchema>;

// --------------------------------
// Errors
// --------------------------------

export const AccountAlreadyExistsError = createError(
  "AccountAlreadyExistsError",
  (userId: string) => `Account for user ${userId} already exists`,
  {
    code: "ACCOUNT_ALREADY_EXISTS",
    error: "Conflict",
    statusCode: 409,
  },
);

export const AccountValidationError = createError(
  "AccountValidationError",
  (field: string) => `${field} is required to create an account`,
  {
    code: "ACCOUNT_VALIDATION",
    error: "Conflict",
    statusCode: 409,
  },
);
