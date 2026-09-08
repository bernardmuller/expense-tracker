import z from "zod";
import { registerRequestSchema } from "../schemas";

export type RegisterRequestParams = z.infer<typeof registerRequestSchema>;
