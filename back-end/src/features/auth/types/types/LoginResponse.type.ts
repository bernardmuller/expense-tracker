import z from "zod";
import { loginResponseSchema } from "../schemas";

export type LoginResponse = z.infer<typeof loginResponseSchema>;
