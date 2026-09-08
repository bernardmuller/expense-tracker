import z from "zod";
import { updateVerificationSchema } from "../schemas";

export type UpdateVerificationParams = z.infer<typeof updateVerificationSchema>;
