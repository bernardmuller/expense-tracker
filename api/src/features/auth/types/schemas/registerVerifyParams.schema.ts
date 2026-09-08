import z from "zod";

export const registerVerifyParamsSchema = z.object({
  otp: z.string(),
});
