import z from "zod";
import { verificationSchema } from "../schemas";

export type Verification = z.infer<typeof verificationSchema>;
