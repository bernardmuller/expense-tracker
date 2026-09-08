import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { Chat } from "../types";
import * as ChatRepo from "../repositories";

export const deleteChat = (id: string, ctx: AppContext): AppResult<Chat> => {
  return ChatRepo.remove(id, ctx);
};
