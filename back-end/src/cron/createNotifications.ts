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
} from "date-fns";

const ACTIVITY_REMINDER_TIME_HOURS = 20;
const BUDGET_END_REMINDER_TIME_HOURS = 16;
const RECURRING_EXPENSE_REMINDER_TIME_HOURS = 18;

async function createNotifications() {
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

  for (const p of user_notification_preferences) {
    // daily reminder
    if (
      p.notification_preferences.type ===
        NOTIFICATION_TYPES.ACTIVITY_REMINDER &&
      now.getTime() === ACTIVITY_REMINDER_TIME_HOURS
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

      const budgetsUpdatedToday = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.isActive, true), eq(budgets.userId, p.users.id)));

      budgetsUpdatedToday.filter((b) => isSameDay(b.updatedAt, now));

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
      isSameHour(now, new Date().setHours(BUDGET_END_REMINDER_TIME_HOURS))
    ) {
      const active_budgets = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.isActive, true), eq(budgets.userId, p.users.id)));

      for (const ab of active_budgets) {
        if (differenceInDays(ab.endDate!, now) === 1) continue;

        const sentBudgetEndNotifications = await db
          .select()
          .from(notifications)
          .where(
            and(
              eq(notifications.userId, p.notification_preferences.userId),
              eq(notifications.type, NOTIFICATION_TYPES.BUDGET_END_REMINDER),
            ),
          );

        sentBudgetEndNotifications.filter(
          (n) => n.sentAt && isSameDay(n.sentAt, now),
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
      isSameHour(
        now,
        new Date().setHours(RECURRING_EXPENSE_REMINDER_TIME_HOURS),
      )
    ) {
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

      console.log("due today => ", dueToday);

      if (dueToday.length) {
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

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

        if (!existingToday.length) {
          await db.insert(notifications).values({
            id: generateUuid(),
            userId: p.notification_preferences.userId,
            type: NOTIFICATION_TYPES.RECURRING_EXPENSE_REMINDER,
            channel: p.notification_preferences.channel,
            message: `Hey, ${p.users.name}. Reminder to go check that the following recurring expenses where paid: ${dueToday
              .map(({ instance }) => instance.description)
              .join(",")}`,
            createdAt: new Date(),
          });
        }
      }
    }
  }
}

setInterval(createNotifications, 1000 * 20);
