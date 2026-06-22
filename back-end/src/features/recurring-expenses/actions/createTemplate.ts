import { ok, type Result } from "neverthrow";
import { generateUuid } from "@/lib/utils/generateUuid";
import type { CreateTemplateParams, RecurringExpenseTemplate } from "../types";

export const createTemplate = (
  userId: string,
  params: CreateTemplateParams,
): Result<RecurringExpenseTemplate, never> => {
  const now = new Date();
  return ok({
    id: generateUuid(),
    userId,
    description: params.description,
    amount: params.amount.toString(),
    categoryId: params.categoryId,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });
};
