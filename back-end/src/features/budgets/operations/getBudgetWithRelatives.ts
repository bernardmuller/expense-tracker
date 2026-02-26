import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as BudgetQueries from "../queries";
import type { Transaction, CategoryBudget } from "../types";
import type { Budget } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import {
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

type BudgetWithDetails = Budget & {
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
};

export const getBudgetWithRelatives = (
  budgetId: string,
  userId: string,
  ctx: AppContext,
): ResultAsync<
  {
    budget: BudgetWithDetails;
    previous: string | null;
    next: string | null;
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> => BudgetQueries.getBudgetWithRelatives(budgetId, userId, ctx);
