import { createInsertSchema } from "drizzle-zod";
import { notificationPreferences } from "@/lib/db/schema";

export const notificationPreferenceInsertSchema = createInsertSchema(notificationPreferences);
