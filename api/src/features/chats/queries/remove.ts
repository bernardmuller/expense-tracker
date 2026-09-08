import type { AppContext } from "@/lib/db/context";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Chat } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const remove = (
  id: string,
  ctx: AppContext,
): AppResult<Chat, DatabaseError> =>
  fromDB(
    ctx.db.delete(chats).where(eq(chats.id, id)).returning(),
  ).andThen(([deleted]) =>
    deleted ? success(deleted) : failure(new DatabaseError("Failed to delete chat")),
  );
