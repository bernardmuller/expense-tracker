import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient, } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AppLayout from '@/components/AppLayout'
import AuthForm from '@/components/AuthForm'
import { useSession } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { BudgetBreakdownList } from '@/components/budget-breakdowns/budget-breakdown-list'
import { useBudgetDetails } from '@/lib/hooks/useBudgetDetails'

export const Route = createFileRoute('/budget/$budgetId')({
  component: BudgetDetailsPage,
})

function BudgetDetailsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: session, isLoading: sessionLoading } = useSession()
  const userId = session?.data?.user.id

  const { data: activeBudget, isLoading: isActiveBudgetLoading } = useBudgetDetails({ userId })

  const handleAuthSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  if (sessionLoading || isActiveBudgetLoading) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
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

  if (!activeBudget?.budget) {
    return (
      <AppLayout title="Budget Not Found" showBackButton>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-bold mb-2">Budget Not Found</h1>
            <p className="text-muted-foreground mb-6">The budget you're looking for doesn't exist.</p>
            <Button onClick={() => navigate({ to: "/budget/create/info" })}>
              Create Budget
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  const amountSpent = Number(activeBudget.budget.startAmount) - Number(activeBudget.budget.currentAmount)
  const highestCategory = activeBudget.categories.sort((a, b) => b.spent - a.spent)[0]

  return (
    <AppLayout
      title="Current Budget"
      subtitle={activeBudget.budget.name}
      showBackButton
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className='p-0'>
            <CardContent className='p-4'>
              <p className="text-muted-foreground text-xs">Total amount spent</p>
              <p className="text-lg font-bold">R{formatCurrency(amountSpent)}</p>
            </CardContent>
          </Card>
          <Card className='p-4 h-20'>
            <CardContent className='p-0'>
              <p className="text-muted-foreground text-xs">Amount Left</p>
              <p className={`text-lg font-bold ${Number(activeBudget.budget.currentAmount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                R{formatCurrency(Number(activeBudget.budget.currentAmount))}
              </p>
            </CardContent>
          </Card>
          <Card className='p-0'>
            <CardContent className='p-4'>
              <p className="text-muted-foreground text-xs">Highest Spending</p>
              <p className="text-lg font-bold text-primary">{highestCategory.name}</p>
              <p className="text-xs text-muted-foreground">R{formatCurrency(highestCategory.spent)}</p>
            </CardContent>
          </Card>
          <Card className='p-0'>
            <CardContent className='p-4'>
              <div className='flex flex-col gap-1'>
                <p className="text-muted-foreground text-xs">Total Expenses</p>
                <p className="text-md font-bold">{activeBudget.budget.expenseCount}</p>
              </div>
              <Button
                variant="link"
                onClick={() => navigate({ to: "/expenses" })}
                className='p-0 m-0 h-0 text-xs'
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </div>
        <BudgetBreakdownList
          categories={activeBudget.categories}
          onCategoryClick={(key) => navigate({
            to: "/expenses",
            search: {
              filter: key
            }
          })}
        />
        <div className='w-full flex justify-center'>
          <Button
            onClick={() => navigate({
              to: '/budget/create/info',
              search: { previousBudgetAmount: parseFloat(activeBudget.budget.startAmount) }
            })}
            className="flex-1"
            variant="destructive"
          >
            Close Budget
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
