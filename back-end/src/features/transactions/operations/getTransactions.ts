import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionQueries from "../queries";
import type { Transaction } from "../types";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { SearchQueries } from "@/lib/http/types";

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
): ResultAsync<Array<Transaction>, InstanceType<typeof EntityReadError>> =>
  TransactionQueries.getTransactions(search, ctx);
