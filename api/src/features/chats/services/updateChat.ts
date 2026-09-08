import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { UpdateChatParams, Chat } from "../types";
import * as ChatRepo from "../repositories";

export const updateChat = (
  id: string,
  params: UpdateChatParams,
  ctx: AppContext,
): AppResult<Chat> => {
  return ChatRepo.update(id, params, ctx);
};
