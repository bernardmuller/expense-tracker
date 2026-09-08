import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { CreateVerificationParams, Verification } from "../types";
import * as VerificationRepo from "../repositories";
import * as VerificationDomain from "../actions";

export const createVerification = (
  params: CreateVerificationParams,
  ctx: AppContext,
): AppResult<Verification> => {
  return VerificationDomain.createVerification(params).asyncAndThen((verification) =>
    VerificationRepo.create(verification, ctx),
  );
};
