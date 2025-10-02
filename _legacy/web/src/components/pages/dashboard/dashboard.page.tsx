import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import RecentExpenses from '@/components/expenses/RecentExpenses'
import AddExpenseForm from '@/components/expenses/AddExpenseForm'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useActiveBudget, useRecentExpenses, useSession, useUserCategories } from '@/lib/hooks'
import CurrentBudget from '@/components/budgets/CurrentBudget'

interface DashboardPageProps {
  amount?: string
  name?: string
}

export default function DashboardPage({ amount, name }: DashboardPageProps) {
  const [isAmountVisible, setIsAmountVisible] = useState(false)
  const navigate = useNavigate()

  const { data: session } = useSession()
  const {
    data: budget,
    isLoading: isActiveBudgetLoading,
    error: activeBudgetError
  } = useActiveBudget({ userId: session?.data?.user.id })
  const {
    data: recentExpenses,
    isLoading: isRecentExpensesLoading,
  } = useRecentExpenses({ budgetId: budget?.id })
  const {
    data: userCategories
  } = useUserCategories(session?.data?.user.id)

  if (activeBudgetError) {
    return (
      <AppLayout title="Error">
        <Card className="border-destructive/50">
          <CardContent className="p-8 text-center bg-destructive/5">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Error Loading Data..</h1>
            <p className="text-destructive/80 mb-4">Unable to load your budget information.</p>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  if (isActiveBudgetLoading || isRecentExpensesLoading) {
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
      <AppLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-2xl font-bold mb-2">Get Started</h1>
            <p className="text-muted-foreground mb-6">Create your first budget to start tracking your expenses!</p>
            <Button onClick={() => navigate({ to: "/budget/create/info" })}>
              Create Budget
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Expense Tracker"
      subtitle={`Welcome back${session?.data?.user.name ? `, ${session.data.user.name}` : ''}!`}
    >
      <div className='flex flex-col gap-4'>
        <CurrentBudget
          budget={budget}
          currencySymbol='R'
          isAmountVisible={isAmountVisible}
          onAmountVisible={() => setIsAmountVisible(prev => !prev)}
        />
        <AddExpenseForm
          defaultAmount={amount ?? ''}
          defaultName={name ?? ''}
          budgetId={budget.id}
          userId={
            session?.data?.user.id
          }
        />
        <RecentExpenses
          currencySymbol="R"
          expenses={recentExpenses}
          categories={userCategories}
        />
      </div>
    </AppLayout>
  )
}