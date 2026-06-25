import z from "zod";
import { updateNotificationPreferenceSchema } from "../schemas";

export type UpdateNotificationPreferenceParams = z.infer<typeof updateNotificationPreferenceSchema>;
