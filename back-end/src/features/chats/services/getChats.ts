import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { Chat } from "../types";
import { SearchQueries } from "@/lib/http/types";
import * as ChatRepo from "../repositories";

export const getChats = (
  search: SearchQueries<
    Chat,
    {
      userId: string;
      chatId: string;
      type: string;
    }
  >,
  ctx: AppContext,
): AppResult<Chat[]> => {
  return ChatRepo.findAll(search, ctx);
};
