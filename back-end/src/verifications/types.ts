import { createError } from "@/lib/utils/createError";
import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { verifications } from "@/db/schema";

// --------------------------------
// Schemas & Types
// --------------------------------

export const verificationInsertSchema = createInsertSchema(verifications);
export const verificationSchema = createSelectSchema(verifications);

export type Verification = z.infer<typeof verificationSchema>;

export const createVerificationSchema = verificationSchema.pick({
  identifier: true,
  value: true,
  expiresAt: true,
});

export type CreateVerificationParams = z.infer<typeof createVerificationSchema>;

// --------------------------------
// Errors
// --------------------------------

export const VerificationValidationError = createError(
  "VerificationValidationError",
  (field: string) => `${field} is required to create a verification`,
  {
    code: "VERIFICATION_VALIDATION",
    error: "Bad Request",
    statusCode: 400,
  },
);
