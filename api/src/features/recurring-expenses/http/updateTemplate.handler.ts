import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { updateTemplate } from "../services";

export const updateTemplateHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const templateId = c.req.param("templateId");
  const body = await c.req.json();
  const ctx = createContext();

  const result = await updateTemplate(
    authedUser.userId,
    templateId,
    body,
    ctx,
  );

  return result.match(
    (template) => c.json(template, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
