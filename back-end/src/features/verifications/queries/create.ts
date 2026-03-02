import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import type { CreateVerificationParams } from "../types";
import type { Verification } from "@/lib/db/schema";
import { generateUuid } from "@/lib/utils/generateUuid";
import { DatabaseError } from "@/lib/errors/domain";
import { AppResult, failure, fromDB, success } from "@/lib/result";

export const create = (
  verification: CreateVerificationParams,
  ctx: AppContext,
): AppResult<Verification, DatabaseError> =>
  fromDB(
    ctx.db
      .insert(verifications)
      .values({
        id: generateUuid(),
        identifier: verification.identifier,
        value: verification.value,
        expiresAt: verification.expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning(),
  ).andThen(([createdVerification]) =>
    createdVerification
      ? success(createdVerification)
      : failure(new DatabaseError("Failed to create verification")),
  );
