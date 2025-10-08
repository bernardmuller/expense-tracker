// ============================================
// Services Definitions
// ============================================

import { Context, Effect, Layer } from "effect";
import type { Transaction } from "@/domain/entities/transaction";
import type { Budget } from "@/domain/entities/budget";
import * as TransactionEntity from "@/domain/entities/transaction";
import * as BudgetEntity from "@/domain/entities/budget";
import type { TransactionType } from "@/domain/entities/enums/transactionType";

// Transaction Repository Service
export class TransactionRepository extends Context.Tag("TransactionRepository")<
  TransactionRepository,
  {
    readonly create: (
      transaction: Transaction,
    ) => Effect.Effect<Transaction, Error>;
    readonly findById: (id: string) => Effect.Effect<Transaction | null, Error>;
  }
>() {}

// Budget Repository Service
export class BudgetRepository extends Context.Tag("BudgetRepository")<
  BudgetRepository,
  {
    readonly findById: (id: string) => Effect.Effect<Budget | null, Error>;
    readonly update: (budget: Budget) => Effect.Effect<Budget, Error>;
  }
>() {}

// Transaction Creation Service
export class TransactionCreationService extends Context.Tag(
  "TransactionCreationService",
)<
  TransactionCreationService,
  {
    readonly createTransaction: (
      params: TransactionEntity.CreateTransactionParams,
    ) => Effect.Effect<
      { transaction: Transaction; updatedBudget: Budget },
      TransactionEntity.MissingRequiredFieldsError | Error
    >;
  }
>() {}

// ============================================
// In-Memory Repository Implementations
// ============================================

export const InMemoryTransactionRepository = Layer.succeed(
  TransactionRepository,
  (() => {
    const store = new Map<string, Transaction>();

    return TransactionRepository.of({
      create: (transaction) =>
        Effect.sync(() => {
          store.set(transaction.id, transaction);
          return transaction;
        }),

      findById: (id) =>
        Effect.sync(() => {
          return store.get(id) ?? null;
        }),
    });
  })(),
);

export const InMemoryBudgetRepository = Layer.succeed(
  BudgetRepository,
  (() => {
    const store = new Map<string, Budget>();

    return BudgetRepository.of({
      findById: (id) =>
        Effect.sync(() => {
          return store.get(id) ?? null;
        }),

      update: (budget) =>
        Effect.sync(() => {
          if (!store.has(budget.id)) {
            throw new Error(`Budget ${budget.id} not found`);
          }
          store.set(budget.id, budget);
          return budget;
        }),
    });
  })(),
);

// ============================================
// Service Implementation
// ============================================

export const TransactionCreationServiceLive = Layer.effect(
  TransactionCreationService,
  Effect.gen(function* () {
    const transactionRepo = yield* TransactionRepository;
    const budgetRepo = yield* BudgetRepository;

    return TransactionCreationService.of({
      createTransaction: (params) =>
        Effect.gen(function* () {
          // Step 1: Validate and create transaction entity
          const transaction =
            yield* TransactionEntity.createTransaction(params);

          // Step 2: Get the associated budget
          const budget = yield* budgetRepo.findById(params.budgetId);
          if (!budget) {
            return yield* Effect.fail(
              new Error(`Budget ${params.budgetId} not found`),
            );
          }

          // Step 3: Check if budget is active (optional validation)
          if (!BudgetEntity.isBudgetActive(budget)) {
            return yield* Effect.fail(
              new Error(`Budget ${params.budgetId} is not active`),
            );
          }

          // Step 4: Update budget based on transaction type
          const updatedBudget =
            params.type === "expense"
              ? yield* BudgetEntity.subtractFromBudgetCurrentAmount(
                  budget,
                  params.amount,
                )
              : yield* BudgetEntity.addToBudgetCurrentAmount(
                  budget,
                  params.amount,
                );

          // Step 5: Persist transaction
          const savedTransaction = yield* transactionRepo.create(transaction);

          // Step 6: Persist updated budget
          const savedBudget = yield* budgetRepo.update(updatedBudget);

          return {
            transaction: savedTransaction,
            updatedBudget: savedBudget,
          };
        }),
    });
  }),
);

// ============================================
// Main Application Layer
// ============================================

export const AppLayer = TransactionCreationServiceLive.pipe(
  Layer.provide(
    Layer.mergeAll(InMemoryTransactionRepository, InMemoryBudgetRepository),
  ),
);

// ============================================
// Usage Example
// ============================================

export const createTransactionExample = Effect.gen(function* () {
  const service = yield* TransactionCreationService;

  // Create an expense transaction
  const expenseResult = yield* service.createTransaction({
    budgetId: "budget-123",
    categoryId: "groceries",
    type: "expense",
    description: "Weekly grocery shopping",
    amount: 150.75,
  });

  console.log("Created transaction:", expenseResult.transaction);
  console.log("Updated budget:", expenseResult.updatedBudget);
  console.log("New budget amount:", expenseResult.updatedBudget.currentAmount);

  return expenseResult;
}).pipe(Effect.provide(AppLayer));

// Run the example
// Effect.runPromise(createTransactionExample)
//   .then(console.log)
//   .catch(console.error);
