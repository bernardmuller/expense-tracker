import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { AuthorizationError } from "@/lib/errors/domain";
import { getTemplatesByUserId } from "../services";

export const listTemplatesHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const userId = c.req.param("userId");

  if (!userId || authedUser.userId !== userId) {
    return mapErrorToResponse(
      new AuthorizationError("Forbidden"),
      c,
    );
  }

  const includeDeleted = c.req.query("includeDeleted") === "true";
  const ctx = createContext();

  const result = await getTemplatesByUserId(userId, ctx, { includeDeleted });

  return result.match(
    (templates) => c.json({ templates }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
