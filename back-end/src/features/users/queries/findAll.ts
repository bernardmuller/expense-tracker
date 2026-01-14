import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";

export const findAll = (ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      return await ctx.db.select().from(users);
    })(),
    (error) => new EntityReadError("User", error),
  );
