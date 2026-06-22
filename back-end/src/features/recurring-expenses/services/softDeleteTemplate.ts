import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, failure } from "@/lib/result";
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
    return RecurringRepo.softDeleteTemplate(templateId, ctx);
  });
