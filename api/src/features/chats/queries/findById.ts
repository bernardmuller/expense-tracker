import type { AppContext } from "@/lib/db/context";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Chat } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findById = (
  id: string,
  ctx: AppContext,
): AppResult<Chat, NotFoundError | DatabaseError> =>
  fromDB(ctx.db.select().from(chats).where(eq(chats.id, id))).andThen(([chat]) =>
    chat ? success(chat) : failure(new NotFoundError(`Chat: ${id}`)),
  );
