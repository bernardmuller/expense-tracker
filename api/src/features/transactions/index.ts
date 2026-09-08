import { createRouter } from "@/lib/http/createApi";
import { createTransactionRoute } from "./http/createTransaction.route";
import { createTransactionHandler } from "./http/createTransaction.handler";
import { getTransactionsRoute } from "./http/getTransactions.route";
import { getTransactionsHandler } from "./http/getTransactions.handler";
import { deleteExpenseRoute } from "./http/deleteExpense.route";
import { deleteExpenseHandler } from "./http/deleteExpense.handler";

export const transactionRouter = createRouter()
  .openapi(createTransactionRoute, createTransactionHandler)
  .openapi(getTransactionsRoute, getTransactionsHandler)
  .openapi(deleteExpenseRoute, deleteExpenseHandler);
