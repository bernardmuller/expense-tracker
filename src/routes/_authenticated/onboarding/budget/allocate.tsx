import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import OnboardingBudgetAllocatePage from '../../../../components/pages/onboarding/onboarding-budget-allocate.page'

const searchSchema = z.object({
  budgetName: z.string(),
  startingAmount: z.number(),
})

export const Route = createFileRoute('/_authenticated/onboarding/budget/allocate')({
  component: () => {
    const { budgetName, startingAmount } = Route.useSearch()
    return (
      <OnboardingBudgetAllocatePage
        budgetName={budgetName}
        startingAmount={startingAmount}
      />
    )
  },
  validateSearch: searchSchema,
})