import type { AppContext } from "@/lib/db/context";
import { recurringExpenseTemplates } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findTemplateById = (
  templateId: string,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .select()
      .from(recurringExpenseTemplates)
      .where(
        and(
          eq(recurringExpenseTemplates.id, templateId),
          isNull(recurringExpenseTemplates.deletedAt),
        ),
      ),
  ).andThen(([template]) =>
    template
      ? success(template)
      : failure(new NotFoundError(`Recurring expense template: ${templateId}`)),
  );
