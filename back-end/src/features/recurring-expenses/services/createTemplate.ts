import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as RecurringDomain from "../actions";
import * as UserRepo from "@/features/users/queries";
import * as CategoryRepo from "@/features/transactions/queries";
import type { CreateTemplateParams, RecurringExpenseTemplate } from "../types";
import { AppResult } from "@/lib/result";

export const createTemplate = (
  userId: string,
  params: CreateTemplateParams,
  ctx: AppContext,
): AppResult<RecurringExpenseTemplate> =>
  UserRepo.findById(userId, ctx).andThen(() =>
    CategoryRepo.findCategoryById(params.categoryId, ctx).andThen(() => {
      const template = RecurringDomain.createTemplate(
        userId,
        params,
      )._unsafeUnwrap();
      return RecurringRepo.insertTemplate(template, ctx);
    }),
  );
