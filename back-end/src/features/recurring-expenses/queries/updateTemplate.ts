import type { AppContext } from "@/lib/db/context";
import { recurringExpenseTemplates } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { RecurringExpenseTemplate, UpdateTemplateParams } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const updateTemplate = (
  templateId: string,
  params: UpdateTemplateParams,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate, NotFoundError | DatabaseError> => {
  const updates: Partial<RecurringExpenseTemplate> & { updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (params.description !== undefined) updates.description = params.description;
  if (params.amount !== undefined) updates.amount = params.amount.toString();
  if (params.categoryId !== undefined) updates.categoryId = params.categoryId;

  return fromDB(
    ctx.db
      .update(recurringExpenseTemplates)
      .set(updates)
      .where(
        and(
          eq(recurringExpenseTemplates.id, templateId),
          isNull(recurringExpenseTemplates.deletedAt),
        ),
      )
      .returning(),
  ).andThen(([updated]) =>
    updated
      ? success(updated)
      : failure(new NotFoundError(`Recurring expense template: ${templateId}`)),
  );
};
