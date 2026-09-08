import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { markInstancePaid, markInstanceUnpaid } from "../services";

export const updateInstanceStatusHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const budgetId = c.req.param("budgetId");
  const instanceId = c.req.param("instanceId");
  const body = await c.req.json();
  const ctx = createContext();

  if (body.isPaid === true) {
    if (!body.expenseData) {
      return c.json(
        {
          error: "Validation Error",
          message: "expenseData is required when marking as paid",
          code: "MISSING_EXPENSE_DATA",
        },
        400,
      );
    }

    const result = await markInstancePaid(
      authedUser.userId,
      budgetId,
      instanceId,
      body.expenseData,
      ctx,
    );

    return result.match(
      (expense) => c.json(expense, 200),
      (error) => mapErrorToResponse(error, c),
    );
  }

  if (body.isPaid === false) {
    if (body.expenseData) {
      return c.json(
        {
          error: "Validation Error",
          message: "expenseData must not be provided when marking as unpaid",
          code: "UNEXPECTED_EXPENSE_DATA",
        },
        400,
      );
    }

    const result = await markInstanceUnpaid(
      authedUser.userId,
      budgetId,
      instanceId,
      ctx,
    );

    return result.match(
      () => c.body(null, 204),
      (error) => mapErrorToResponse(error, c),
    );
  }

  return c.json(
    {
      error: "Validation Error",
      message: "isPaid must be true or false",
      code: "INVALID_PAYLOAD",
    },
    400,
  );
};
