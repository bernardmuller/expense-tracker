import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { deleteUnpaidInstance } from "../services";

export const deleteInstanceHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const budgetId = c.req.param("budgetId");
  const instanceId = c.req.param("instanceId");
  const ctx = createContext();

  const result = await deleteUnpaidInstance(
    authedUser.userId,
    budgetId,
    instanceId,
    ctx,
  );

  return result.match(
    () => c.body(null, 204),
    (error) => mapErrorToResponse(error, c),
  );
};
