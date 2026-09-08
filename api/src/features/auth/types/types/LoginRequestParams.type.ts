import z from "zod";
import { loginRequestSchema } from "../schemas";

export type LoginRequestParams = z.infer<typeof loginRequestSchema>;
