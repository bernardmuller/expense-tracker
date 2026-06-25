import { createSelectSchema } from "drizzle-zod";
import { notificationPreferences } from "@/lib/db/schema";

export const notificationPreferenceSchema = createSelectSchema(notificationPreferences);
