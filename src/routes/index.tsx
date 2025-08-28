import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import BudgetDisplay from '../components/BudgetDisplay'
import RecentExpenses from '../components/RecentExpenses'
import AddExpenseForm from '../components/AddExpenseForm'
import StartNewBudgetModal from '../components/StartNewBudgetModal'
import AuthForm from '../components/AuthForm'
import AppLayout from '../components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useActiveBudget, useSession } from '@/lib/hooks'

type Transaction = {
  amount?: string,
  name?: string
}

export const Route = createFileRoute('/')({
  component: ExpenseTracker,
  validateSearch: (transaction: Record<string, unknown>): Transaction => {
    return {
      amount: transaction.amount ? transaction.amount.toString() : undefined,
      name: transaction.name ? transaction.name.toString() : undefined
    }
  }
})

function ExpenseTracker() {
  const { amount, name } = Route.useSearch();
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: session, isLoading: sessionLoading } = useSession()

  const handleAuthSuccess = () => {
    // Refresh session data after successful auth
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const userId = session?.data?.user.id

  const { data: budget, isLoading, error } = useActiveBudget({ userId })

  if (sessionLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex h-[70vh] justify-center items-center">
          <div className='flex flex-col gap-1'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!session?.data?.user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </AppLayout>
    )
  }


  if (error) {
    return (
      <AppLayout title="Error">
        <Card className="border-destructive/50">
          <CardContent className="p-8 text-center bg-destructive/5">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Error Loading Data</h1>
            <p className="text-destructive/80 mb-4">Unable to load your budget information.</p>
            <Button onClick={() => setIsNewBudgetModalOpen(true)}>
              Create Budget
            </Button>
          </CardContent>
        </Card>
        <StartNewBudgetModal
          isOpen={isNewBudgetModalOpen}
          onClose={() => setIsNewBudgetModalOpen(false)}
          userId={userId!}
        />
      </AppLayout>
    )
  }

  if (isLoading) {
    return (
      <AppLayout title="Loading...">
        <div className="animate-pulse">
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!budget) {
    return (
      <AppLayout
        title={`Welcome${session.data.user.name ? `, ${session.data.user.name}` : ''}!`}
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-2xl font-bold mb-2">Get Started</h1>
            <p className="text-muted-foreground mb-6">Create your first budget to start tracking your expenses!</p>
            <Button onClick={() => setIsNewBudgetModalOpen(true)}>
              Create Budget
            </Button>
          </CardContent>
        </Card>
        <StartNewBudgetModal
          isOpen={isNewBudgetModalOpen}
          onClose={() => setIsNewBudgetModalOpen(false)}
          userId={userId!}
        />
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Expense Tracker"
      subtitle={`Welcome back${session.data.user.name ? `, ${session.data.user.name}` : ''}!`}
    >
      <div className='flex flex-col gap-4'>
        <BudgetDisplay userId={userId!} />
        <AddExpenseForm
          defaultAmount={amount ?? ''}
          defaultName={name ?? ''}
          budgetId={budget.id}
          userId={userId!}
        />
        <RecentExpenses budgetId={budget.id} />
        <StartNewBudgetModal
          isOpen={isNewBudgetModalOpen}
          onClose={() => setIsNewBudgetModalOpen(false)}
          userId={userId!}
          previousBudgetAmount={parseFloat(budget.startAmount)}
        />
      </div>
    </AppLayout>
  )
}
