import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getChats } from "../services";

export const getChatsHandler = async (c: Context) => {
  const ctx = createContext();
  const result = await getChats(ctx);

  return result.match(
    (chats) => c.json({ chats, count: chats.length }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
