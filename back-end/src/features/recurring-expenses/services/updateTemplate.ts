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
  scheduledAt: string,
  ctx: AppContext,
): AppResult<undefined> =>
  NotificationPreferencesRepo.findAll(
    {
      userId,
      type: NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
      channel: NOTIFICATION_CHANNELS.TELEGRAM,
    },
    ctx,
  ).andThen((prefs) => {
    const pref = prefs[0];
    if (!pref) return success(undefined);
    return NotificationPreferencesRepo.update(
      pref.id,
      userId,
      { scheduledAt: computeScheduledDate(parseInt(scheduledAt, 10)) },
      ctx,
    ).map(() => undefined);
  });

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
          ? syncNotificationPreference(userId, params.scheduledAt, ctx).map(
              () => updated,
            )
          : success(updated),
      );
  });
