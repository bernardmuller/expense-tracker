import { createRouter } from "@/lib/http/createApi";
import { createTransactionRoute } from "./createTransaction.route";
import { createTransactionHandler } from "./createTransaction.handler";
import { getTransactionsRoute } from "./getTransactions.route";
import { getTransactionsHandler } from "./getTransactions.handler";
import { deleteExpenseRoute } from "./deleteExpense.route";
import { deleteExpenseHandler } from "./deleteExpense.handler";

export const transactionRouter = createRouter()
  .openapi(createTransactionRoute, createTransactionHandler)
  .openapi(getTransactionsRoute, getTransactionsHandler)
  .openapi(deleteExpenseRoute, deleteExpenseHandler);

// Barrel exports
export * from "./createTransaction.route";
export * from "./createTransaction.handler";
export * from "./getTransactions.route";
export * from "./getTransactions.handler";
export * from "./deleteExpense.route";
export * from "./deleteExpense.handler";
