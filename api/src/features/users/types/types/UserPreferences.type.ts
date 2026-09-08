import z from "zod";
import { userPreferencesSchema } from "../schemas";

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
