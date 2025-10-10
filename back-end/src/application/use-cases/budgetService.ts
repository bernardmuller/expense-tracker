import { Context, Effect, Layer, pipe } from "effect";
import type { CreateBudgetParams, Budget } from "@/domain/entities/budget";
import * as BudgetEntity from "@/domain/entities/budget";
import { BudgetRepository } from "@/domain/repositories/budgetRepository";
import { BudgetService } from "@/domain/use-cases/budgetService";

export const BudgetServiceLive = Layer.effect(
  BudgetService,
  pipe(
    BudgetRepository,
    Effect.map((budgetRepository) => ({
      createBudget: (params: CreateBudgetParams) =>
        pipe(
          BudgetEntity.createBudget(params),
          Effect.andThen(budgetRepository.create),
        ),
      getBudgetById: (id: string) => budgetRepository.findById(id),
      getBudgetSpentAmount: (budget: Budget) =>
        BudgetEntity.getBudgetSpentAmount(budget),
      getBudgetSpentPercentage: (budget: Budget) =>
        BudgetEntity.getBudgetSpentPercentage(budget),
      setBudgetActive: (budget: Budget) =>
        pipe(
          BudgetEntity.setBudgetActive(budget),
          Effect.andThen(budgetRepository.update),
        ),
      setBudgetInactive: (budget: Budget) =>
        pipe(
          BudgetEntity.setBudgetInactive(budget),
          Effect.andThen(budgetRepository.update),
        ),
      isBudgetActive: (budget: Budget) =>
        BudgetEntity.isBudgetActive(budget),
      isBudgetOverbudget: (budget: Budget) =>
        BudgetEntity.isBudgetOverbudget(budget),
      updateBudgetName: (budget: Budget, params: Budget) =>
        pipe(
          BudgetEntity.updateBudgetName(budget, params.name),
          Effect.andThen(budgetRepository.update),
        ),
      addToBudgetCurrentAmount: (budget: Budget, amount: number) =>
        pipe(
          BudgetEntity.addToBudgetCurrentAmount(budget, amount),
          Effect.andThen(budgetRepository.update),
        ),
      subtractFromBudgetCurrentAmount: (budget: Budget, amount: number) =>
        pipe(
          BudgetEntity.subtractFromBudgetCurrentAmount(budget, amount),
          Effect.andThen(budgetRepository.update),
        ),
    })),
  ),
);
