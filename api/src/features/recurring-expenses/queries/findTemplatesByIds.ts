import type { AppContext } from "@/lib/db/context";
import { recurringExpenseTemplates } from "@/lib/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, fromDB, success } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";

export const findTemplatesByIds = (
  templateIds: string[],
  userId: string,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate[], DatabaseError> => {
  if (templateIds.length === 0) {
    return success([]);
  }

  return fromDB(
    ctx.db
      .select()
      .from(recurringExpenseTemplates)
      .where(
        and(
          inArray(recurringExpenseTemplates.id, templateIds),
          eq(recurringExpenseTemplates.userId, userId),
          isNull(recurringExpenseTemplates.deletedAt),
        ),
      ),
  ).andThen((templates) => success(templates));
};
