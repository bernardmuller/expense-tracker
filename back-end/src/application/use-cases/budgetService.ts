import { Context, Effect, Layer } from "effect";
import type { CreateBudgetParams, Budget } from "@/domain/entities/budget";
import * as budgetEntity from "@/domain/entities/budget";
import { BudgetRepository } from "@/domain/repositories/budgetRepository";
import { BudgetService } from "@/domain/use-cases/budgetService";

export const BudgetServiceLive = Layer.effect(
  BudgetService,
  Effect.gen(function* () {
    const budgetRepository = yield* BudgetRepository;

    return {
      createbudget: (params: CreatebudgetParams) =>
        Effect.gen(function* () {
          const budget = yield* budgetService.createbudget(params);
          return yield* budgetRepository.create(budget);
        }),

      updatebudget: (budget: budget, params: budget) =>
        Effect.gen(function* () {
          const updatedbudget = yield* budgetEntity.updatebudget(
            budget,
            params,
          );
          return yield* budgetRepository.create(updatedbudget);
        }),
    };
  }),
);
