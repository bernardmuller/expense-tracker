import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as RecurringDomain from "../actions";
import * as UserRepo from "@/features/users/queries";
import * as CategoryRepo from "@/features/transactions/queries";
import * as NotificationPreferencesRepo from "@/features/notification-preferences/queries";
import type { CreateTemplateParams, RecurringExpenseTemplate } from "../types";
import { AppResult } from "@/lib/result";
import { NOTIFICATION_CHANNELS } from "@/lib/constants/notificationChannels";
import { NOTIFICATION_TYPES } from "@/lib/constants";
import { computeScheduledDate } from "@/lib/utils/computeScheduledDate";
import { ok } from "neverthrow";

export const createTemplate = (
  userId: string,
  params: CreateTemplateParams,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate> =>
  UserRepo.findById(userId, ctx).andThen(() =>
    CategoryRepo.findCategoryById(params.categoryId, ctx)
      .andThen(() => {
        const template = RecurringDomain.createTemplate(
          userId,
          params,
        )._unsafeUnwrap();
        return RecurringRepo.insertTemplate(template, ctx);
      })
      .andThen((template) => {
        return NotificationPreferencesRepo.create(
          template.userId,
          {
            type: NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
            channel: NOTIFICATION_CHANNELS.TELEGRAM,
            enabled: false,
            entityId: template.id,
            scheduledAt: computeScheduledDate(parseInt(params.scheduledAt, 10)),
          },
          ctx,
        ).map(() => template);
      }),
  );
