import { verificationSchema } from "./verification.schema";

export const updateVerificationSchema = verificationSchema
  .pick({ identifier: true, value: true, expiresAt: true })
  .partial();
