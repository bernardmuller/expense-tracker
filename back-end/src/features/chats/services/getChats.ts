import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { Chat } from "../types";
import * as ChatRepo from "../repositories";

export const getChats = (ctx: AppContext): AppResult<Chat[]> => {
  return ChatRepo.findAll(ctx);
};
