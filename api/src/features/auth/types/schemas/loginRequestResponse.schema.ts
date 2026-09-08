import z from "zod";

export const loginRequestResponseSchema = z.object({
	token: z.string(),
	otp: z.string().optional(),
});
