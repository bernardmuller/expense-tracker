import type { AppContext } from "@/lib/db/context";
import { chats } from "@/lib/db/schema";
import type { CreateChatParams, Chat } from "../types";
import { generateUuid } from "@/lib/utils/generateUuid";
import { DatabaseError } from "@/lib/errors/domain";
import { AppResult, fromDB, success, failure } from "@/lib/result";

export const create = (
  params: CreateChatParams,
  ctx: AppContext,
): AppResult<Chat, DatabaseError> =>
  fromDB(
    ctx.db
      .insert(chats)
      .values({
        id: generateUuid(),
        userId: params.userId,
        chatId: params.chatId,
        type: params.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning(),
  ).andThen(([created]) =>
    created ? success(created) : failure(new DatabaseError("Failed to create chat")),
  );
