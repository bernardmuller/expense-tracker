import z from "zod";
import { loginRequestResponseSchema } from "../schemas";

export type LoginRequestResponse = z.infer<typeof loginRequestResponseSchema>;
