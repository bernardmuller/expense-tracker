import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as NotificationPreferencesRepo from "../../notification-preferences/queries";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, failure, success } from "@/lib/result";
import { NotFoundError } from "@/lib/errors/domain";

export const softDeleteTemplate = (
  userId: string,
  templateId: string,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate> =>
  RecurringRepo.findTemplateById(templateId, ctx).andThen((template) => {
    if (template.userId !== userId) {
      return failure(
        new NotFoundError(`Recurring expense template: ${templateId}`),
      );
    }
    return NotificationPreferencesRepo.findByEntityId(templateId, userId, ctx)
      .andThen((pref) =>
        NotificationPreferencesRepo.remove(pref.id, userId, ctx).map(
          () => undefined,
        ),
      )
      .orElse((err) =>
        err instanceof NotFoundError ? success(undefined) : failure(err),
      )
      .andThen(() => RecurringRepo.softDeleteTemplate(templateId, ctx));
  });
