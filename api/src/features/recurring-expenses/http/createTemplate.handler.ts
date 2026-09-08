import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { AuthorizationError } from "@/lib/errors/domain";
import { createTemplate } from "../services";

export const createTemplateHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const userId = c.req.param("userId");

  if (!userId || authedUser.userId !== userId) {
    return mapErrorToResponse(new AuthorizationError("Forbidden"), c);
  }

  const body = await c.req.json();
  const ctx = createContext();

  const result = await createTemplate(userId, body, ctx);

  return result.match(
    (template) => c.json(template, 201),
    (error) => mapErrorToResponse(error, c),
  );
};
