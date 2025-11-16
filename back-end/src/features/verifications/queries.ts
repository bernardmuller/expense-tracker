import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Verification, CreateVerificationParams } from "./types";
import { generateUuid } from "@/lib/utils/generateUuid";

export const create = (
  verification: CreateVerificationParams,
  ctx: AppContext,
) =>
  ResultAsync.fromPromise(
    (async () => {
      if (
        !verification.identifier ||
        !verification.value ||
        !verification.expiresAt
      ) {
        throw new Error(
          "Missing required fields: identifier, value, or expiresAt",
        );
      }
      const now = new Date();
      const [createdVerification] = await ctx.db
        .insert(verifications)
        .values({
          id: generateUuid(),
          identifier: verification.identifier,
          value: verification.value,
          expiresAt: verification.expiresAt,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      if (!createdVerification) throw new EntityCreateError("Verification");
      return createdVerification;
    })(),
    (error) =>
      error instanceof EntityCreateError
        ? error
        : new EntityCreateError(String(error), error),
  );

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
