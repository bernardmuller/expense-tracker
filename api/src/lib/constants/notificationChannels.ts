export const NOTIFICATION_CHANNELS = {
  TELEGRAM: "telegram",
} as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS];
