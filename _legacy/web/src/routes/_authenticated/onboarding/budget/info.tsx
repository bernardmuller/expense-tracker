import { createFileRoute } from '@tanstack/react-router'
import OnboardingBudgetInfoPage from '../../../../components/pages/onboarding/onboarding-budget-info.page'

export const Route = createFileRoute('/_authenticated/onboarding/budget/info')({
  component: OnboardingBudgetInfoPage,
})