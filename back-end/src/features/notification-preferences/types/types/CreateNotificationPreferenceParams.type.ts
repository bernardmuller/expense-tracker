import z from "zod";
import { createNotificationPreferenceSchema } from "../schemas";

export type CreateNotificationPreferenceParams = z.infer<typeof createNotificationPreferenceSchema>;
