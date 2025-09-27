import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import BudgetCreateCategoriesPage from '../../../../components/pages/budget/budget-create-categories.page'

const searchSchema = z.object({
  budgetName: z.string(),
  startingAmount: z.number(),
  previousBudgetAmount: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/budget/create/categories')({
  component: () => {
    const { budgetName, startingAmount, previousBudgetAmount } = Route.useSearch()
    return (
      <BudgetCreateCategoriesPage
        budgetName={budgetName}
        startingAmount={startingAmount}
        previousBudgetAmount={previousBudgetAmount}
      />
    )
  },
  validateSearch: searchSchema,
})
