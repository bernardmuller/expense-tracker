import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient, } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AppLayout from '@/components/AppLayout'
import AuthForm from '@/components/AuthForm'
import { useActiveBudget, useAllCategories, useAllExpenses, useSession, useUserCategories } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { getCategoryInfo } from '@/lib/category-utils'
import StartNewBudgetModal from '@/components/StartNewBudgetModal'
import { ProgressBreakdown } from '@/components/budget-breakdowns/progress-breakdown'
import { useBudgetDetails } from '@/lib/hooks/useBudgetDetails'

const getBudgetById = async (data: { budgetId: number }) => {
  const { getBudgetById } = await import('../server/budgets')
  return getBudgetById({ data })
}

const getCategoryBudgets = async (budgetId: number) => {
  const { getCategoryBudgets } = await import('../server/budgets')
  return getCategoryBudgets({ data: { budgetId } })
}

const searchSchema = z.object({
  mode: z.enum(['view', 'new']).optional().default('view'),
  previousBudgetAmount: z.number().optional(),
})

export const Route = createFileRoute('/budget/$budgetId')({
  component: BudgetSummaryPage,
  validateSearch: searchSchema,
})

const generateColors = (count: number): Array<string> => {
  const colors = []
  const goldenRatio = 0.618033988749
  let hue = 0
  for (let i = 0; i < count; i++) {
    hue = (hue + goldenRatio * 360) % 360
    const saturation = 65 + (i % 3) * 10 // 65%, 75%, 85%
    const lightness = 45 + (i % 4) * 10   // 45%, 55%, 65%, 75%
    colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`)
  }
  return colors
}

function BudgetSummaryPage() {
  const { budgetId } = Route.useParams()
  const { mode } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: allCategories } = useAllCategories()
  const userId = session?.data?.user.id

  const { data: activeBudget, isLoading: isActiveBudgetLoading } = useBudgetDetails({ userId })

  console.log("active budget: ", activeBudget)

  const { data: userCategories, isLoading: userCategoriesLoading } = useUserCategories(userId)

  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ['budget', budgetId],
    queryFn: async () => getBudgetById({ budgetId: parseInt(budgetId) }),
    enabled: !!budgetId,
  })

  const { data: expenses, isLoading: expensesLoading } = useAllExpenses({
    budgetId: parseInt(budgetId)
  })

  const { data: categoryBudgets, isLoading: categoryBudgetsLoading } = useQuery({
    queryKey: ['categoryBudgets', budgetId],
    queryFn: () => getCategoryBudgets(parseInt(budgetId)),
    enabled: !!budgetId,
  })

  const handleAuthSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const handleBack = () => {
    if (mode === 'new') {
      navigate({ to: '/expenses' })
    } else {
      navigate({ to: '/' })
    }
  }

  const categoryData = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return []
    return expenses.reduce(
      (acc, expense) => {
        const existing = acc.find((item) => item.category === expense.category)
        const amount = parseFloat(expense.amount)
        if (existing) {
          existing.amount += amount
          existing.count += 1
        } else {
          acc.push({
            category: expense.category,
            amount: amount,
            count: 1,
          })
        }
        return acc
      },
      [] as Array<{ category: string; amount: number; count: number }>,
    )
  }, [expenses])

  const totalAmount = categoryData.length > 0 ? categoryData.reduce((sum, item) => sum + item.amount, 0) : 0
  const budgetTotal = budget ? parseFloat(budget.startAmount) : 0
  const amountLeft = budgetTotal - totalAmount
  const totalExpenses = expenses?.length || 0
  const highestCategory = categoryData.length > 0
    ? categoryData.reduce((max, item) =>
      (item.amount > max.amount ? item : max),
      { category: "", amount: 0 }
    )
    : { category: "", amount: 0 }

  const highestCategoryInfo = highestCategory.category ?
    getCategoryInfo(highestCategory.category, allCategories) :
    { label: 'None' }

  const colors = generateColors(categoryData.length)

  const pieData = userCategories?.map((item, index) => {
    const categoryExpense = categoryData.find(c => item.category.key === c.category)
    return {
      name: item.category.key,
      key: item.category.key,
      value: categoryExpense ? categoryExpense.amount : 0,
      percentage: totalAmount > 0 && categoryExpense ?
        ((categoryExpense.amount / totalAmount) * 100).toFixed(1) : '0',
      color: colors[index],
    }
  })

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

  if (!budget) {
    return (
      <AppLayout title="Budget Not Found" showBackButton>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-bold mb-2">Budget Not Found</h1>
            <p className="text-muted-foreground mb-6">The budget you're looking for doesn't exist.</p>
            <Button onClick={handleBack}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }
  return (
    <AppLayout
      title="Current Budget"
      subtitle={budget.name}
      showBackButton
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className='p-0'>
            <CardContent className='p-4'>
              <p className="text-muted-foreground text-xs">Total amount spent</p>
              <p className="text-lg font-bold">R{formatCurrency(totalAmount)}</p>
            </CardContent>
          </Card>
          <Card className='p-4 h-20'>
            <CardContent className='p-0'>
              <p className="text-muted-foreground text-xs">Amount Left</p>
              <p className={`text-lg font-bold ${amountLeft >= 0 ? "text-green-600" : "text-red-600"}`}>
                R{formatCurrency(amountLeft)}
              </p>
            </CardContent>
          </Card>

          <Card className='p-0'>
            <CardContent className='p-4'>
              <p className="text-muted-foreground text-xs">Highest Spending</p>
              <p className="text-lg font-bold text-primary">{highestCategoryInfo.label}</p>
              <p className="text-xs text-muted-foreground">R{formatCurrency(highestCategory.amount)}</p>
            </CardContent>
          </Card>
          <Card className='p-0'>
            <CardContent className='p-4'>
              <div className='flex gap-1'>
                <p className="text-md font-bold">{totalExpenses}</p>
                <p className="text-muted-foreground text-md">expenses</p>
              </div>
              <p className="text-xs text-muted-foreground">Over {pieData?.length ?? 0} categories</p>
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

        {activeBudget?.categories && (
          <ProgressBreakdown categories={activeBudget.categories} />)}

        <div className='w-full flex justify-center'>
          <Button
            onClick={() => navigate({
              to: '/budget/create/info',
              search: { previousBudgetAmount: parseFloat(budget.startAmount) }
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
