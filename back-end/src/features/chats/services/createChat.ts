import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { CreateChatParams, Chat } from "../types";
import * as ChatRepo from "../repositories";

export const createChat = (params: CreateChatParams, ctx: AppContext): AppResult<Chat> => {
  return ChatRepo.create(params, ctx);
};
