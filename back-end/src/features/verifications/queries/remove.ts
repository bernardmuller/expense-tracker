import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Verification } from "@/lib/db/schema";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const remove = (
  id: string,
  ctx: AppContext,
): AppResult<Verification, DatabaseError> =>
  fromDB(
    ctx.db.delete(verifications).where(eq(verifications.id, id)).returning(),
  ).andThen(([deletedVerification]) =>
    deletedVerification
      ? success(deletedVerification)
      : failure(new DatabaseError("Failed to delete verification")),
  );
