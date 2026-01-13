import { verificationSchema } from "./verification.schema";

export const createVerificationSchema = verificationSchema.pick({
  identifier: true,
  value: true,
  expiresAt: true,
});
