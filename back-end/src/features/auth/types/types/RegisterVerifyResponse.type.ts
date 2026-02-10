import z from "zod";
import { registerVerifyResponseSchema } from "../schemas";

export type RegisterVerifyResponse = z.infer<typeof registerVerifyResponseSchema>;
