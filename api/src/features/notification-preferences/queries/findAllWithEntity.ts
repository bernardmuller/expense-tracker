import type { AppContext } from "@/lib/db/context";
import {
  notificationPreferences,
  recurringExpenseTemplates,
} from "@/lib/db/schema";
import { and, asc, desc, eq, isNull, SQL } from "drizzle-orm";
import type { SearchQueries } from "@/lib/http/types";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";
import { NOTIFICATION_TYPES } from "@/lib/constants/notificationTypes";
import type {
  NotificationPreference,
  NotificationPreferenceWithEntity,
} from "../types";
import type { NotificationPreferenceFilters } from "./findAll";

export const findAllWithEntity = (
  search: SearchQueries<NotificationPreference, NotificationPreferenceFilters>,
  ctx: AppContext,
): AppResult<NotificationPreferenceWithEntity[], DatabaseError> => {
  const conditions: SQL[] = [];
  if (search.userId !== undefined)
    conditions.push(eq(notificationPreferences.userId, search.userId));
  if (search.type !== undefined)
    conditions.push(eq(notificationPreferences.type, search.type));
  if (search.channel !== undefined)
    conditions.push(eq(notificationPreferences.channel, search.channel));
  if (search.enabled !== undefined)
    conditions.push(eq(notificationPreferences.enabled, search.enabled));

  let qb = ctx.db
    .select({
      id: notificationPreferences.id,
      userId: notificationPreferences.userId,
      entityId: notificationPreferences.entityId,
      type: notificationPreferences.type,
      enabled: notificationPreferences.enabled,
      channel: notificationPreferences.channel,
      scheduledAt: notificationPreferences.scheduledAt,
      createdAt: notificationPreferences.createdAt,
      updatedAt: notificationPreferences.updatedAt,
      template: {
        id: recurringExpenseTemplates.id,
        description: recurringExpenseTemplates.description,
        amount: recurringExpenseTemplates.amount,
        scheduledAt: recurringExpenseTemplates.scheduledAt,
        categoryId: recurringExpenseTemplates.categoryId,
      },
    })
    .from(notificationPreferences)
    .leftJoin(
      recurringExpenseTemplates,
      and(
        eq(notificationPreferences.entityId, recurringExpenseTemplates.id),
        eq(
          notificationPreferences.type,
          NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
        ),
        isNull(recurringExpenseTemplates.deletedAt),
      ),
    )
    .$dynamic();

  if (conditions.length > 0) qb = qb.where(and(...conditions));

  if (search.sort === "createdAt") {
    qb = qb.orderBy(
      search.order === "desc"
        ? desc(notificationPreferences.createdAt)
        : asc(notificationPreferences.createdAt),
    );
  }

  if (search.limit !== undefined && search.limit > 0) qb = qb.limit(search.limit);
  if (search.offset !== undefined && search.offset >= 0)
    qb = qb.offset(search.offset);

  return fromDB(
    qb.then((rows): NotificationPreferenceWithEntity[] =>
      rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        entityId: row.entityId,
        type: row.type,
        enabled: row.enabled,
        channel: row.channel,
        scheduledAt: row.scheduledAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        template:
          row.template && row.template.id !== null
            ? {
                id: row.template.id,
                description: row.template.description!,
                amount: row.template.amount!,
                scheduledAt: row.template.scheduledAt!,
                categoryId: row.template.categoryId,
              }
            : null,
      })),
    ),
  );
};
