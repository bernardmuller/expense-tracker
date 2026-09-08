import type { AppContext } from "@/lib/db/context";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Chat } from "../types";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findAll = (
  search: SearchQueries<
    Chat,
    {
      userId: string;
      chatId: string;
      type: string;
    }
  >,
  ctx: AppContext,
): AppResult<Chat[], DatabaseError> => {
  const queryBuilder = ctx.db.select().from(chats);

  return fromDB(
    buildDrizzleQuery(
      queryBuilder,
      search,
      {
        userId: (value) => eq(chats.userId, value),
        chatId: (value) => eq(chats.chatId, value),
        type: (value) => eq(chats.type, value),
      },
      {
        createdAt: chats.createdAt,
      },
    ),
  );
};
