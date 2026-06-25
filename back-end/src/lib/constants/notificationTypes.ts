export const NOTIFICATION_TYPES = {
  ACTIVITY_REMINDER: "activity-reminder",
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
