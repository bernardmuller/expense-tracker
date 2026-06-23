import type { AppContext } from "@/lib/db/context";
import { chats } from "@/lib/db/schema";
import type { Chat } from "../types";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findAll = (ctx: AppContext): AppResult<Chat[], DatabaseError> =>
  fromDB(ctx.db.select().from(chats));
