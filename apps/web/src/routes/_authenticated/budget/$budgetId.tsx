import { createFileRoute } from '@tanstack/react-router'
import BudgetDetailsPage from '../../../components/pages/budget/budget-details.page'

export const Route = createFileRoute('/_authenticated/budget/$budgetId')({
  component: BudgetDetailsPage,
})
