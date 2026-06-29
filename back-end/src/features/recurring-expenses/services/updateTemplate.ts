import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as CategoryRepo from "@/features/transactions/queries";
import * as NotificationPreferencesRepo from "@/features/notification-preferences/queries";
import type { RecurringExpenseTemplate, UpdateTemplateParams } from "../types";
import { AppResult, success, failure } from "@/lib/result";
import { NotFoundError } from "@/lib/errors/domain";
import { NOTIFICATION_TYPES } from "@/lib/constants";
import { NOTIFICATION_CHANNELS } from "@/lib/constants/notificationChannels";
import { computeScheduledDate } from "@/lib/utils/computeScheduledDate";

const syncNotificationPreference = (
  userId: string,
  templateId: string,
  scheduledAt: string,
  ctx: AppContext,
): AppResult<undefined> => {
  const scheduledDate = computeScheduledDate(parseInt(scheduledAt, 10));
  return NotificationPreferencesRepo.findByEntityId(templateId, userId, ctx)
    .map((pref) => pref as typeof pref | null)
    .orElse((err) =>
      err instanceof NotFoundError ? success(null) : failure(err),
    )
    .andThen((pref) =>
      pref
        ? NotificationPreferencesRepo.update(
            pref.id,
            userId,
            { scheduledAt: scheduledDate },
            ctx,
          ).map(() => undefined)
        : NotificationPreferencesRepo.create(
            userId,
            {
              type: NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
              channel: NOTIFICATION_CHANNELS.TELEGRAM,
              enabled: false,
              entityId: templateId,
              scheduledAt: scheduledDate,
            },
            ctx,
          ).map(() => undefined),
    );
};

export const updateTemplate = (
  userId: string,
  templateId: string,
  params: UpdateTemplateParams,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate> =>
  RecurringRepo.findTemplateById(templateId, ctx).andThen((template) => {
    if (template.userId !== userId) {
      return failure(
        new NotFoundError(`Recurring expense template: ${templateId}`),
      );
    }

    const guardCategory = params.categoryId
      ? CategoryRepo.findCategoryById(params.categoryId, ctx).andThen(() =>
          success(undefined),
        )
      : success(undefined);

    return guardCategory
      .andThen(() => RecurringRepo.updateTemplate(templateId, params, ctx))
      .andThen((updated) =>
        params.scheduledAt !== undefined
          ? syncNotificationPreference(
              userId,
              templateId,
              params.scheduledAt,
              ctx,
            ).map(() => updated)
          : success(updated),
      );
  });
