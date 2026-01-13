import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import {
  EntityCreateError,
} from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";
import type { CreateVerificationParams } from "../types";
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
