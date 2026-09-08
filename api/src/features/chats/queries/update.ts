import type { AppContext } from "@/lib/db/context";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { UpdateChatParams, Chat } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const update = (
  id: string,
  params: UpdateChatParams,
  ctx: AppContext,
): AppResult<Chat, DatabaseError> =>
  fromDB(
    ctx.db
      .update(chats)
      .set({ ...params, updatedAt: new Date() })
      .where(eq(chats.id, id))
      .returning(),
  ).andThen(([updated]) =>
    updated ? success(updated) : failure(new DatabaseError("Failed to update chat")),
  );
