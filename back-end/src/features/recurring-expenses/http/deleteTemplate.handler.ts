import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { softDeleteTemplate } from "../services";

export const deleteTemplateHandler = async (c: Context) => {
  const authedUser = c.get("user") as { userId: string };
  const templateId = c.req.param("templateId");
  const ctx = createContext();

  const result = await softDeleteTemplate(authedUser.userId, templateId, ctx);

  return result.match(
    () => c.body(null, 204),
    (error) => mapErrorToResponse(error, c),
  );
};
