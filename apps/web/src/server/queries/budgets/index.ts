import { getActiveBudgetByUserId } from "./getActiveBudgetByUserId"
import { createBudgetQuery } from "./createBudgetQuery"
import { createBudgetWithCategoriesQuery } from "./createBudgetWithCategoriesQuery"
import { getBudgetByIdQuery } from "./getBudgetByIdQuery"
import { getCategoryBudgetsQuery } from "./getCategoryBudgetsQuery"
import { getUserBudgetsQuery } from "./getUserBudgetsQuery"
import { updateBudgetAmountQuery } from "./updateBudgetAmountQuery"

// export type ActiveBudgetByUserId = Awaited<ReturnType<typeof getActiveBudgetByUserId>>
// export type CreateBudgetResult = Awaited<ReturnType<typeof createBudgetQuery>>
// export type CreateBudgetWithCategoriesResult = Awaited<ReturnType<typeof createBudgetWithCategoriesQuery>>
// export type BudgetById = Awaited<ReturnType<typeof getBudgetByIdQuery>>
// export type CategoryBudgets = Awaited<ReturnType<typeof getCategoryBudgetsQuery>>
// export type UserBudgets = Awaited<ReturnType<typeof getUserBudgetsQuery>>
// export type UpdateBudgetAmountResult = Awaited<ReturnType<typeof updateBudgetAmountQuery>>

export {
  getActiveBudgetByUserId,
  createBudgetQuery,
  createBudgetWithCategoriesQuery,
  getBudgetByIdQuery,
  getCategoryBudgetsQuery,
  getUserBudgetsQuery,
  updateBudgetAmountQuery
}
