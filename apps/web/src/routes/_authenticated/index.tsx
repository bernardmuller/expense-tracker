import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '../../components/pages/dashboard/dashboard.page'

type Transaction = {
  amount?: string,
  name?: string
}

export const Route = createFileRoute('/_authenticated/')({
  component: () => {
    const { amount, name } = Route.useSearch()
    return <DashboardPage amount={amount} name={name} />
  },
  validateSearch: (transaction: Record<string, unknown>): Transaction => {
    return {
      amount: transaction.amount ? transaction.amount.toString() : undefined,
      name: transaction.name ? transaction.name.toString() : undefined
    }
  }
})
