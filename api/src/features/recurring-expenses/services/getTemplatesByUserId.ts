import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import type { RecurringExpenseTemplate } from "../types";
import { AppResult } from "@/lib/result";

export const getTemplatesByUserId = (
  userId: string,
  ctx: AppContext,
  options?: { includeDeleted?: boolean },
): AppResult<RecurringExpenseTemplate[]> =>
  RecurringRepo.findTemplatesByUserId(userId, ctx, options);
