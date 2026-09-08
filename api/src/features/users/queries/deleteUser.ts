import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const deleteUser = (
  userId: string,
  ctx: AppContext,
): AppResult<boolean, DatabaseError> =>
  fromDB(ctx.db.delete(users).where(eq(users.id, userId))).map(() => true);
