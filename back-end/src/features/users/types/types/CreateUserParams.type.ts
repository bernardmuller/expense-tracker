import z from "zod";
import { createUserSchema } from "../schemas";

export type CreateUserParams = z.infer<typeof createUserSchema>;
