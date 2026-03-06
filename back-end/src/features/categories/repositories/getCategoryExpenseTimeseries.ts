import type { AppContext } from "@/lib/db/context";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";
import { expenses, budgets, categoryBudgets } from "@/lib/db/schema";
import { eq, and, gte, isNull } from "drizzle-orm";
import type { TimeseriesDataPoint } from "../types";

export const getCategoryExpenseTimeseries = (
  userId: string,
  categoryId: string,
  months: number,
  granularity: "month" | "budget",
  ctx: AppContext,
): AppResult<TimeseriesDataPoint[], DatabaseError> => {
  if (granularity === "budget") {
    return getCategoryExpenseTimeseriesByBudget(
      userId,
      categoryId,
      months,
      ctx,
    );
  }
  return getCategoryExpenseTimeseriesByMonth(userId, categoryId, months, ctx);
};

const getCategoryExpenseTimeseriesByMonth = (
  userId: string,
  categoryId: string,
  months: number,
  ctx: AppContext,
): AppResult<TimeseriesDataPoint[], DatabaseError> => {
  // Calculate the earliest date (first day of the month N months ago)
  const currentDate = new Date();
  const earliestDate = new Date(currentDate);
  earliestDate.setMonth(currentDate.getMonth() - (months - 1));
  earliestDate.setDate(1);
  earliestDate.setHours(0, 0, 0, 0);

  return fromDB(
    ctx.db
      .select({
        id: expenses.id,
        amount: expenses.amount,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .innerJoin(budgets, eq(expenses.budgetId, budgets.id))
      .where(
        and(
          eq(budgets.userId, userId),
          eq(expenses.categoryId, categoryId),
          gte(expenses.createdAt, earliestDate),
          isNull(expenses.deletedAt),
        ),
      ),
  ).map((expensesList) => {
    // Helper function to format date as YYYY-MM-DD
    const formatMonthKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Generate array of month start dates
    const monthsArray: Date[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      monthDate.setDate(1);
      monthDate.setHours(0, 0, 0, 0);
      monthsArray.push(monthDate);
    }

    // Group expenses by month
    const expensesByMonth = new Map<
      string,
      { count: number; total: number }
    >();

    for (const expense of expensesList) {
      const expenseDate = new Date(expense.createdAt);
      expenseDate.setDate(1);
      expenseDate.setHours(0, 0, 0, 0);
      const monthKey = formatMonthKey(expenseDate);

      const existing = expensesByMonth.get(monthKey) || {
        count: 0,
        total: 0,
      };
      expensesByMonth.set(monthKey, {
        count: existing.count + 1,
        total: existing.total + parseFloat(String(expense.amount)),
      });
    }

    // Merge with generated months to ensure all months are present (even with no expenses)
    return monthsArray
      .map((monthDate) => {
        const monthKey = formatMonthKey(monthDate);
        const data = expensesByMonth.get(monthKey) || { count: 0, total: 0 };

        return {
          period: monthKey,
          expenseCount: data.count,
          totalAmount: data.total,
        };
      })
      .reverse(); // Reverse to get DESC order (most recent first)
  });
};

const getCategoryExpenseTimeseriesByBudget = (
  userId: string,
  categoryId: string,
  months: number,
  ctx: AppContext,
): AppResult<TimeseriesDataPoint[], DatabaseError> => {
  // Calculate the earliest date (first day of the month N months ago)
  const currentDate = new Date();
  const earliestDate = new Date(currentDate);
  earliestDate.setMonth(currentDate.getMonth() - (months - 1));
  earliestDate.setDate(1);
  earliestDate.setHours(0, 0, 0, 0);

  // Query expenses with budget and categoryBudget info
  return fromDB(
    ctx.db
      .select({
        expenseId: expenses.id,
        amount: expenses.amount,
        budgetId: budgets.id,
        budgetName: budgets.name,
        allocatedAmount: categoryBudgets.allocatedAmount,
      })
      .from(expenses)
      .innerJoin(budgets, eq(expenses.budgetId, budgets.id))
      .leftJoin(
        categoryBudgets,
        and(
          eq(categoryBudgets.budgetId, budgets.id),
          eq(categoryBudgets.categoryId, categoryId),
        ),
      )
      .where(
        and(
          eq(budgets.userId, userId),
          eq(expenses.categoryId, categoryId),
          gte(expenses.createdAt, earliestDate),
          isNull(expenses.deletedAt),
        ),
      ),
  ).map((expensesList) => {
    // Group expenses by budget (aggregate across all months)
    const budgetAggregates = new Map<
      string,
      {
        budgetId: string;
        budgetName: string;
        count: number;
        total: number;
        allocatedAmount: string | null;
      }
    >();

    for (const expense of expensesList) {
      const existing = budgetAggregates.get(expense.budgetId);

      if (existing) {
        existing.count += 1;
        existing.total += parseFloat(String(expense.amount));
      } else {
        budgetAggregates.set(expense.budgetId, {
          budgetId: expense.budgetId,
          budgetName: expense.budgetName,
          count: 1,
          total: parseFloat(String(expense.amount)),
          allocatedAmount: expense.allocatedAmount,
        });
      }
    }

    // Convert to array and sort by budgetName
    return Array.from(budgetAggregates.values())
      .map((budget) => ({
        expenseCount: budget.count,
        totalAmount: budget.total,
        budgetId: budget.budgetId,
        budgetName: budget.budgetName,
        budgetAmount: budget.allocatedAmount
          ? parseFloat(String(budget.allocatedAmount))
          : undefined,
      }))
      .sort((a, b) => a.budgetName.localeCompare(b.budgetName));
  });
};
