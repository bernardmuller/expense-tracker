import z from "zod";
import { notificationPreferenceSchema } from "../schemas";

export type NotificationPreference = z.infer<typeof notificationPreferenceSchema>;
