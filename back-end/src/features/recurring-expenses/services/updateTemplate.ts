import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as CategoryRepo from "@/features/transactions/queries";
import type { RecurringExpenseTemplate, UpdateTemplateParams } from "../types";
import { AppResult, success, failure } from "@/lib/result";
import { NotFoundError } from "@/lib/errors/domain";

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

    return guardCategory.andThen(() =>
      RecurringRepo.updateTemplate(templateId, params, ctx),
    );
  });
