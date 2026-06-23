import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createChat } from "../services";

export const createChatHandler = async (c: Context) => {
  const body = await c.req.json();
  const ctx = createContext();
  const result = await createChat(body, ctx);

  return result.match(
    (chat) => c.json({ chat }, 201),
    (error) => mapErrorToResponse(error, c),
  );
};
