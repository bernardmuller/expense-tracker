import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { deleteChat } from "../services";

export const deleteChatHandler = async (c: Context) => {
  const id = c.req.param("id");
  const ctx = createContext();
  const result = await deleteChat(id, ctx);

  return result.match(
    (chat) => c.json({ chat }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
