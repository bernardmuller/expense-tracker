import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { Verification } from "../types";
import * as VerificationRepo from "../repositories";

export const getVerificationById = (
  id: string,
  ctx: AppContext,
): AppResult<Verification> => {
  return VerificationRepo.findById(id, ctx);
};
