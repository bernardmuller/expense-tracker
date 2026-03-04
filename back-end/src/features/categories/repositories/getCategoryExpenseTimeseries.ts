import type { AppContext } from "@/lib/db/context";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";
import { sql } from "drizzle-orm";
import type { TimeseriesDataPoint } from "../types";

type RawTimeseriesRow = {
  month_start: string;
  expense_count: string;
  total_amount: string;
};

export const getCategoryExpenseTimeseries = (
  userId: string,
  categoryId: string,
  months: number,
  ctx: AppContext,
): AppResult<TimeseriesDataPoint[], DatabaseError> => {
  const query = sql<RawTimeseriesRow>`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '${sql.raw(`${months - 1} months`)}',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      )::date AS month_start
    ),
    expense_totals AS (
      SELECT
        date_trunc('month', e."created_at")::date AS month_start,
        COUNT(*) AS expense_count,
        SUM(e."amount") AS total_amount
      FROM "expenses" e
      JOIN "budgets" b ON e."budget_id" = b."id"
      WHERE b."user_id" = ${userId}
        AND e."category_id" = ${categoryId}
        AND e."created_at" >= date_trunc('month', CURRENT_DATE) - INTERVAL '${sql.raw(`${months - 1} months`)}'
        AND e."deleted_at" IS NULL
      GROUP BY date_trunc('month', e."created_at")
    )
    SELECT
      m.month_start,
      COALESCE(et.expense_count, 0) AS expense_count,
      COALESCE(et.total_amount, 0) AS total_amount
    FROM months m
    LEFT JOIN expense_totals et USING (month_start)
    ORDER BY m.month_start DESC;
  `;

  return fromDB(ctx.db.execute(query)).map((result) => {
    const rows = result as unknown as RawTimeseriesRow[];
    return rows.map((row) => ({
      period: row.month_start,
      expenseCount: parseInt(String(row.expense_count), 10),
      totalAmount: parseFloat(String(row.total_amount)),
    }));
  });
};
