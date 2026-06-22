import type { AppContext } from "@/lib/db/context";
import { recurringExpenseTemplates } from "@/lib/db/schema";
import { and, asc, eq, isNull } from "drizzle-orm";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult, fromDB, success } from "@/lib/result";
import type { DatabaseError } from "@/lib/errors/domain";

export const findTemplatesByUserId = (
  userId: string,
  ctx: AppContext,
  options?: { includeDeleted?: boolean },
): AppResult<RecurringExpenseTemplate[], DatabaseError> =>
  fromDB(
    ctx.db
      .select()
      .from(recurringExpenseTemplates)
      .where(
        options?.includeDeleted
          ? eq(recurringExpenseTemplates.userId, userId)
          : and(
              eq(recurringExpenseTemplates.userId, userId),
              isNull(recurringExpenseTemplates.deletedAt),
            ),
      )
      .orderBy(asc(recurringExpenseTemplates.createdAt)),
  ).andThen((templates) => success(templates));
