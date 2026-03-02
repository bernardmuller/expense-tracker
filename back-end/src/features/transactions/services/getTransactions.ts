import type { AppContext } from "@/lib/db/context";
import * as TransactionRepo from "../queries/index";
import type { Transaction } from "../types";
import { SearchQueries } from "@/lib/http/types";
import { AppResult } from "@/lib/result";

export const getTransactions = (
  search: SearchQueries<
    Transaction,
    {
      budgetId: string;
      categoryId: string;
      userId: string;
      description: string;
    }
  >,
  ctx: AppContext,
): AppResult<Array<Transaction>> =>
  TransactionRepo.getTransactions(search, ctx);
