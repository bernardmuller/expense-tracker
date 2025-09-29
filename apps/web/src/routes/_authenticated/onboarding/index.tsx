import { createFileRoute } from '@tanstack/react-router'
import OnboardingWelcomePage from '../../../components/pages/onboarding/onboarding-welcome.page'

export const Route = createFileRoute('/_authenticated/onboarding/')({
  component: OnboardingWelcomePage,
})