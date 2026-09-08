import type { NotificationPreference } from "./NotificationPreference.type";

export type RecurringExpenseTemplateSummary = {
  id: string;
  description: string;
  amount: string;
  scheduledAt: string;
  categoryId: string | null;
};

export type NotificationPreferenceWithEntity = NotificationPreference & {
  template: RecurringExpenseTemplateSummary | null;
};
