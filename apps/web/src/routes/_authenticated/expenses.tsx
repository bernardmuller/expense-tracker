import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import ExpensesPage from '../../components/pages/expenses/expenses.page'

const routeSearchSchema = z.object({
  filter: z.string().optional()
})

export const Route = createFileRoute('/_authenticated/expenses')({
  component: () => {
    const { filter } = Route.useSearch()
    return <ExpensesPage filter={filter} />
  },
  validateSearch: routeSearchSchema
})