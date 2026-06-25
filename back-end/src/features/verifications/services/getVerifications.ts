import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { Verification } from "../types";
import { SearchQueries } from "@/lib/http/types";
import * as VerificationRepo from "../repositories";

export const getVerifications = (
  search: SearchQueries<
    Verification,
    {
      identifier: string;
      value: string;
    }
  >,
  ctx: AppContext,
): AppResult<Verification[]> => {
  return VerificationRepo.findAll(search, ctx);
};
