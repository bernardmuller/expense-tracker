import z from "zod";
import { registerVerifyParamsSchema } from "../schemas";

export type RegisterVerifyParams = z.infer<typeof registerVerifyParamsSchema>;
