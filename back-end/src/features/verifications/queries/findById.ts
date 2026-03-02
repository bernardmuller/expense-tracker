import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Verification } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findById = (
  id: string,
  ctx: AppContext,
): AppResult<Verification, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db.select().from(verifications).where(eq(verifications.id, id)),
  ).andThen(([verification]) =>
    verification
      ? success(verification)
      : failure(new NotFoundError(`Verification: ${id}`)),
  );
