export const NOTIFICATION_TYPES = {
  ACTIVITY_REMINDER: "activity-reminder",
  RECURRING_EXPENSE_REMINDER: "recurring-expense-reminder",
  BUDGET_END_REMINDER: "budget-end-reminder",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
