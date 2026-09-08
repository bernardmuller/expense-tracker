import z from "zod";
import { loginAttemptSchema } from "../schemas";

export type LoginAttemptParams = z.infer<typeof loginAttemptSchema> & {
  token: string;
};
