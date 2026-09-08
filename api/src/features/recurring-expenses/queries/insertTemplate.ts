import type { AppContext } from "@/lib/db/context";
import { recurringExpenseTemplates } from "@/lib/db/schema";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const insertTemplate = (
  template: RecurringExpenseTemplate,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate, DatabaseError> =>
  fromDB(
    ctx.db
      .insert(recurringExpenseTemplates)
      .values({
        id: template.id,
        userId: template.userId,
        description: template.description,
        amount: template.amount,
        categoryId: template.categoryId,
        scheduledAt: template.scheduledAt,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        deletedAt: template.deletedAt,
      })
      .returning(),
  ).andThen(([created]) =>
    created
      ? success(created)
      : failure(new DatabaseError("Failed to create recurring expense template")),
  );
