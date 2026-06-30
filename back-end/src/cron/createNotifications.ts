import { db } from "@/lib/db";
import {
  budgetRecurringExpenses,
  budgets,
  chats,
  notificationPreferences,
  notifications,
  recurringExpenseTemplates,
  users,
} from "@/lib/db/schema";
import { and, eq, gte, isNotNull, isNull } from "drizzle-orm";
import { generateUuid } from "@/lib/utils/generateUuid";
import { NOTIFICATION_TYPES } from "@/lib/constants";
import {
  addDays,
  differenceInDays,
  getDaysInMonth,
  isLastDayOfMonth,
  isSameDay,
  isSameHour,
  setHours,
} from "date-fns";

const ACTIVITY_REMINDER_TIME_HOURS = 20;
const BUDGET_END_REMINDER_TIME_HOURS = 9;
const RECURRING_EXPENSE_REMINDER_TIME_HOURS = 20;

async function createNotifications() {
  try {
    const user_notification_preferences = await db
      .select()
      .from(notificationPreferences)
      .innerJoin(chats, eq(chats.userId, notificationPreferences.userId))
      .innerJoin(users, eq(users.id, notificationPreferences.userId))
      .leftJoin(
        recurringExpenseTemplates,
        eq(notificationPreferences.entityId, recurringExpenseTemplates.id),
      )
      .where(eq(notificationPreferences.enabled, true));

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    for (const p of user_notification_preferences) {
      // daily reminder
      if (
        p.notification_preferences.type ===
          NOTIFICATION_TYPES.ACTIVITY_REMINDER &&
        isSameHour(now, setHours(now, ACTIVITY_REMINDER_TIME_HOURS))
      ) {
        const pendingDaily = await db
          .select()
          .from(notifications)
          .where(
            and(
              isNull(notifications.sentAt),
              eq(notifications.userId, p.notification_preferences.userId),
              eq(notifications.type, NOTIFICATION_TYPES.ACTIVITY_REMINDER),
            ),
          );

        const userBudgets = await db
          .select()
          .from(budgets)
          .where(
            and(eq(budgets.isActive, true), eq(budgets.userId, p.users.id)),
          );

        const budgetsUpdatedToday = userBudgets.filter((b) =>
          isSameDay(b.updatedAt, now),
        );

        if (!pendingDaily.length && !budgetsUpdatedToday.length) {
          await db.insert(notifications).values({
            id: generateUuid(),
            userId: p.notification_preferences.userId,
            type: NOTIFICATION_TYPES.ACTIVITY_REMINDER,
            channel: p.notification_preferences.channel,
            message: `Hey, ${p.users.name}. If you spent any money today, this is your reminder to go log them on the Expenny app!`,
            createdAt: new Date(),
          });
        }
      }

      // budget end
      if (
        p.notification_preferences.type ===
          NOTIFICATION_TYPES.BUDGET_END_REMINDER &&
        isSameHour(now, setHours(now, BUDGET_END_REMINDER_TIME_HOURS))
      ) {
        const active_budgets = await db
          .select()
          .from(budgets)
          .where(
            and(eq(budgets.isActive, true), eq(budgets.userId, p.users.id)),
          );

        for (const ab of active_budgets) {
          if (differenceInDays(ab.endDate!, now) !== 1) continue;

          const sentBudgetEndNotifications = await db
            .select()
            .from(notifications)
            .where(
              and(
                eq(notifications.userId, p.notification_preferences.userId),
                eq(notifications.type, NOTIFICATION_TYPES.BUDGET_END_REMINDER),
                gte(notifications.createdAt, startOfToday),
              ),
            );

          if (!sentBudgetEndNotifications.length) {
            await db.insert(notifications).values({
              id: generateUuid(),
              userId: p.notification_preferences.userId,
              type: NOTIFICATION_TYPES.BUDGET_END_REMINDER,
              channel: p.notification_preferences.channel,
              message: `Hey, ${p.users.name}. Reminder to review your current budget before tomorrow's budget end!`,
              createdAt: new Date(),
            });
          }
        }
      }

      if (
        p.notification_preferences.type ===
          NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER &&
        isSameHour(now, setHours(now, RECURRING_EXPENSE_REMINDER_TIME_HOURS))
      ) {
        if (!p.notification_preferences.entityId) continue;

        const dueRecurringInstances = await db
          .select({ instance: budgetRecurringExpenses })
          .from(budgetRecurringExpenses)
          .innerJoin(budgets, eq(budgetRecurringExpenses.budgetId, budgets.id))
          .where(
            and(
              eq(budgets.userId, p.users.id),
              eq(budgets.isActive, true),
              eq(budgetRecurringExpenses.isPaid, false),
              isNull(budgetRecurringExpenses.deletedAt),
              isNotNull(budgetRecurringExpenses.scheduledAt),
              eq(
                budgetRecurringExpenses.templateId,
                p.notification_preferences.entityId,
              ),
            ),
          );

        const dueToday = dueRecurringInstances.filter(({ instance }) => {
          const day = Number(instance.scheduledAt);
          const overflow = day > getDaysInMonth(now);
          return (
            (overflow && isLastDayOfMonth(addDays(now, 1))) ||
            now.getDate() === day
          );
        });

        if (dueToday.length) {
          const existingToday = await db
            .select()
            .from(notifications)
            .where(
              and(
                eq(notifications.userId, p.notification_preferences.userId),
                eq(
                  notifications.type,
                  NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
                ),
                gte(notifications.createdAt, startOfToday),
              ),
            );

          const alreadySentForEntity = existingToday.some((n) =>
            n.message.includes(dueToday[0]!.instance.description),
          );

          if (!alreadySentForEntity) {
            await db.insert(notifications).values({
              id: generateUuid(),
              userId: p.notification_preferences.userId,
              type: NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
              channel: p.notification_preferences.channel,
              message: `Hey, ${p.users.name}. Reminder to go check that "${dueToday[0]!.instance.description}" was paid.`,
              createdAt: new Date(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("createNotifications tick failed:", err);
  }
}

createNotifications();
