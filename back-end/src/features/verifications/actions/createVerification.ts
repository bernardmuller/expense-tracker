import { generateUuid } from "@/lib/utils/generateUuid";
import { ok, type Result } from "neverthrow";
import type { CreateVerificationParams, Verification } from "../types";

const ONE_HOUR_MS = 60 * 60 * 1000

export const createVerification = (
	params: CreateVerificationParams,
): Result<Verification, never> => {
	const uuid = generateUuid();
	const now = new Date();
	const expiresAt = new Date(Date.now() + ONE_HOUR_MS)
	return ok({
		...params,
		id: uuid,
		identifier: generateUuid(),
		value: params.value,
		expiresAt: expiresAt,
		createdAt: now,
		updatedAt: now,
	});
}
