import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import { EntityDeleteError } from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export const deleteUser = (userId: string, ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      await ctx.db.delete(users).where(eq(users.id, userId));
      return true;
    })(),
    (error) => new EntityDeleteError("User", error),
  );
