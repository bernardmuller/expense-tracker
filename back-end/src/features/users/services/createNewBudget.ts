import type { AppContext } from "@/lib/db/context";
import { createNewBudget as createNewBudgetRepo } from "../repositories";
import type { CreateBudgetParams } from "../types/types";
import type { Budget } from "@/lib/db/schema";
import { AppResult } from "@/lib/result";

export const createNewBudget = (
  userId: string,
  params: CreateBudgetParams,
  ctx: AppContext,
): AppResult<Budget> => createNewBudgetRepo(userId, params, ctx);
