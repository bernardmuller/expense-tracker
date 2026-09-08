import type { AppContext } from "@/lib/db/context";
import { recurringExpenseTemplates } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const softDeleteTemplate = (
  templateId: string,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate, NotFoundError | DatabaseError> => {
  const now = new Date();
  return fromDB(
    ctx.db
      .update(recurringExpenseTemplates)
      .set({ deletedAt: now, updatedAt: now })
      .where(
        and(
          eq(recurringExpenseTemplates.id, templateId),
          isNull(recurringExpenseTemplates.deletedAt),
        ),
      )
      .returning(),
  ).andThen(([deleted]) =>
    deleted
      ? success(deleted)
      : failure(new NotFoundError(`Recurring expense template: ${templateId}`)),
  );
};
