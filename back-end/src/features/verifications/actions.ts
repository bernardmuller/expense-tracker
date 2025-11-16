import { generateUuid } from "@/lib/utils/generateUuid";
import { ok, type Result } from "neverthrow";
import type { CreateVerificationParams, Verification } from "./types";

export const createVerification = (
  params: CreateVerificationParams,
): Result<Verification, never> => {
  const uuid = generateUuid();
  const now = new Date();
  return ok({
    ...params,
    id: uuid,
    identifier: params.identifier,
    value: params.value,
    expiresAt: params.expiresAt,
    createdAt: now,
    updatedAt: now,
  });
};
