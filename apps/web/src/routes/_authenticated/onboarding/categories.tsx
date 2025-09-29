import { createFileRoute } from '@tanstack/react-router'
import OnboardingCategoriesPage from '../../../components/pages/onboarding/onboarding-categories.page'

export const Route = createFileRoute('/_authenticated/onboarding/categories')({
  component: OnboardingCategoriesPage,
})