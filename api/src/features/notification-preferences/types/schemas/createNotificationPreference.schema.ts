import { notificationPreferenceSchema } from "./notificationPreference.schema";

export const createNotificationPreferenceSchema =
  notificationPreferenceSchema.pick({
    type: true,
    channel: true,
    enabled: true,
    entityId: true,
    scheduledAt: true,
  });
