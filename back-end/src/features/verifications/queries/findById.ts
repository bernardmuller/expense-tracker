import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Verification } from "../types";

export const findById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  Verification,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(verifications).where(eq(verifications.id, id)),
    (error) => new EntityReadError("Verification", String(error)),
  ).andThen(([verification]) =>
    verification
      ? okAsync(verification)
      : errAsync(new EntityNotFoundError(`Verification: ${id}`)),
  );
