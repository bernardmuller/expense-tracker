import { Effect } from "effect";
import { TransactionService } from "@/domain/use-cases/transactionService";
import { AppLayer } from "@/infrastructure/layers/appLayer";

/**
 * Example: Creating a transaction
 *
 * This example demonstrates the complete flow of creating a transaction:
 * 1. Validates transaction parameters
 * 2. Fetches the associated budget
 * 3. Checks if the budget is active
 * 4. Updates the budget based on transaction type (expense/income)
 * 5. Persists both the transaction and updated budget
 */
export const createTransactionExample = Effect.gen(function* () {
  const service = yield* TransactionService;

  // Create an expense transaction
  const transaction = yield* service.createTransaction({
    budgetId: "budget-123",
    categoryId: "groceries",
    type: "expense",
    description: "Weekly grocery shopping",
    amount: 150.75,
  });

  console.log("Created transaction:", transaction);

  return transaction;
}).pipe(Effect.provide(AppLayer));

// Run the example
// Effect.runPromise(createTransactionExample)
//   .then(console.log)
//   .catch(console.error);
