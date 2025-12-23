import { ResultAsync, okAsync, errAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionQueries from "./queries";
import * as TransactionDomain from "./actions";
import type { Transaction } from "./types";
import type { Budget, CategoryBudget } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { SearchQueries } from "@/lib/http/types";

export const getBudgetExpenses = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
    categoryBudgets: CategoryBudget[];
    categoryBreakdown: Array<{
      id: string;
      key: string;
      label: string;
      icon: string;
      spent: string;
      allocated: string | null;
    }>;
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => TransactionQueries.getBudgetWithExpensesByBudgetId(budgetId, userId, ctx);

export const getBudgets = (
  search: SearchQueries<
    Budget,
    {
      userId: string;
      isActive: boolean;
    }
  >,
  ctx: AppContext,
): ResultAsync<
  Array<Budget>,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => TransactionQueries.getBudgets(search, ctx);

export const getActiveBudgetWithExpenses = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => TransactionQueries.getActiveBudgetWithExpenses(userId, ctx);
