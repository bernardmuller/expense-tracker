import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Verification } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";
import type { UpdateVerificationParams } from "../types";

export const update = (
  id: string,
  params: UpdateVerificationParams,
  ctx: AppContext,
): AppResult<Verification, DatabaseError> =>
  fromDB(
    ctx.db
      .update(verifications)
      .set({ ...params, updatedAt: new Date() })
      .where(eq(verifications.id, id))
      .returning(),
  ).andThen(([updated]) =>
    updated
      ? success(updated)
      : failure(new DatabaseError("Failed to update verification")),
  );
