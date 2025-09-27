import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import BudgetCreateInfoPage from '../../../../components/pages/budget/budget-create-info.page'

const searchSchema = z.object({
  previousBudgetAmount: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/budget/create/info')({
  component: () => {
    const { previousBudgetAmount } = Route.useSearch()
    return <BudgetCreateInfoPage previousBudgetAmount={previousBudgetAmount} />
  },
  validateSearch: searchSchema,
})
