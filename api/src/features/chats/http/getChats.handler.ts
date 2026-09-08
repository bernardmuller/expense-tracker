import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { getChats } from "../services";
import type { Chat } from "../types";

export const getChatsHandler = async (c: Context) => {
  return parseSearchQuery<
    Chat,
    {
      userId: string;
      chatId: string;
      type: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["createdAt"],
    filterKeys: ["userId", "chatId", "type"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return getChats(search, ctx);
    })
    .match(
      (chats) => c.json({ chats, count: chats.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};
