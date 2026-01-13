import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createTransaction } from "../operations";

export const createTransactionHandler = async (c: Context) => {
  const budgetId = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await createTransaction(
    budgetId,
    body,
    ctx,
  );

  return result.match(
    (transaction) => c.json(transaction, 201),
    (error) => mapErrorToResponse(error, c),
  );
};
