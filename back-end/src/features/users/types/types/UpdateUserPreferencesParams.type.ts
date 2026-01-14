import z from "zod";
import { updateUserPreferencesSchema } from "../schemas";

export type UpdateUserPreferencesParams = z.infer<
  typeof updateUserPreferencesSchema
>;
