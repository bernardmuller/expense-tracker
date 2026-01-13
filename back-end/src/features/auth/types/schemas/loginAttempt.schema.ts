import z from "zod";

export const loginAttemptSchema = z.object({
  otp: z.string(),
});
