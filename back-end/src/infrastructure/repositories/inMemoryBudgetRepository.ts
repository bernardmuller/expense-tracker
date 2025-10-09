import { Effect, Layer } from "effect";
import { BudgetRepository } from "@/domain/repositories/budgetRepository";
import type { Budget } from "@/domain/entities/budget";

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
