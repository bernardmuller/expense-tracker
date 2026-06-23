import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { updateChat } from "../services";

export const updateChatHandler = async (c: Context) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await updateChat(id, body, ctx);

  return result.match(
    (chat) => c.json({ chat }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
