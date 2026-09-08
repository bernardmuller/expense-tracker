import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { UpdateVerificationParams, Verification } from "../types";
import * as VerificationRepo from "../repositories";

export const updateVerification = (
  id: string,
  params: UpdateVerificationParams,
  ctx: AppContext,
): AppResult<Verification> => {
  return VerificationRepo.update(id, params, ctx);
};
