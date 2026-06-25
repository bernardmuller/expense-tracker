import { verificationSchema } from "./verification.schema";

export const createVerificationSchema = verificationSchema.pick({
	value: true,
});
