import z from "zod";
import { createVerificationSchema } from "../schemas";

export type CreateVerificationParams = z.infer<typeof createVerificationSchema>;
