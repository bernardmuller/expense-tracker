import { ResultAsync, okAsync, errAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as BudgetQueries from "./queries";
import * as BudgetDomain from "./actions";
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
import {
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

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
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => BudgetQueries.getBudgetWithExpensesByBudgetId(budgetId, userId, ctx);

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
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => BudgetQueries.getBudgets(search, ctx);

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
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => BudgetQueries.getActiveBudgetWithExpenses(userId, ctx);
