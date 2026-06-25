import { notificationPreferenceSchema } from "./notificationPreference.schema";

export const updateNotificationPreferenceSchema = notificationPreferenceSchema
  .pick({ type: true, channel: true, enabled: true, scheduledAt: true })
  .partial();
