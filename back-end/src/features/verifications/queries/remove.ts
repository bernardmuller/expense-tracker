import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import { EntityDeleteError } from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";
import { eq } from "drizzle-orm";

export const remove = (id: string, ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      const [deletedVerification] = await ctx.db
        .delete(verifications)
        .where(eq(verifications.id, id))
        .returning();
      if (!deletedVerification) throw new EntityDeleteError("Verification");
      return deletedVerification;
    })(),
    (error) =>
      error instanceof EntityDeleteError
        ? error
        : new EntityDeleteError(String(error), error),
  );
