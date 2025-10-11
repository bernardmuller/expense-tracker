import { Context, Effect, Layer, pipe } from "effect";
import type { CreateBudgetParams, Budget } from "@/domain/entities/budget";
import type { BudgetServiceShape } from "@/domain/use-cases/budgetService";
import type { BudgetValidationError } from "@/domain/entities/budget/budgetErrors";
import type { EntityCreateError, EntityReadError } from "@/domain/errors/repositoryErrors";
import * as BudgetEntity from "@/domain/entities/budget";
import { BudgetRepository } from "@/domain/repositories/budgetRepository";
import { BudgetService } from "@/domain/use-cases/budgetService";
import type { ReadParams } from "@/domain/repositories/baseRepository";

export const BudgetServiceLive = Layer.effect(
  BudgetService,
  pipe(
    BudgetRepository,
    Effect.map((budgetRepository): BudgetServiceShape => {
      const service: BudgetServiceShape = {
        createBudget: (params: CreateBudgetParams): Effect.Effect<Budget, BudgetValidationError | EntityCreateError> =>
          pipe(
            BudgetEntity.createBudget(params),
            Effect.andThen(budgetRepository.create),
          ),
        getAllBudgets: (params?: ReadParams<Budget>): Effect.Effect<Budget[], EntityReadError> =>
          budgetRepository.read(params ?? {}),
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
        isBudgetActive: (budget: Budget) => BudgetEntity.isBudgetActive(budget),
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
      };
      return service;
    }),
  ),
);
