import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import AppLayout from '@/components/AppLayout'
import AuthForm from '@/components/AuthForm'
import { useSession, useAllExpenses, useAllCategories } from '@/lib/hooks'
import { queryKeys } from '@/lib/query-client'
import { formatCurrency } from '@/lib/utils'
import { getCategoryInfo } from '@/lib/category-utils'
import { z } from 'zod'
import StartNewBudgetModal from '@/components/StartNewBudgetModal'

const createBudget = async (data: { userId: string; name: string; startAmount: number }) => {
  const { createBudget } = await import('../server/budgets')
  return createBudget({ data })
}

const getBudgetById = async (data: { budgetId: number }) => {
  const { getBudgetById } = await import('../server/budgets')
  return getBudgetById({ data })
}

interface Expense {
  id: number
  description: string
  category: string
  amount: string
  createdAt: string
}

const searchSchema = z.object({
  mode: z.enum(['view', 'new']).optional().default('view'),
  previousBudgetAmount: z.number().optional(),
})

export const Route = createFileRoute('/budget/$budgetId')({
  component: BudgetSummaryPage,
  validateSearch: searchSchema,
})

// Generate unlimited distinct colors for categories
const generateColors = (count: number): string[] => {
  const colors = []

  // Use golden ratio for optimal hue distribution
  const goldenRatio = 0.618033988749
  let hue = 0

  for (let i = 0; i < count; i++) {
    // Generate well-distributed hues using golden ratio
    hue = (hue + goldenRatio * 360) % 360

    // Vary saturation and lightness for better distinction
    const saturation = 65 + (i % 3) * 10 // 65%, 75%, 85%
    const lightness = 45 + (i % 4) * 10   // 45%, 55%, 65%, 75%

    colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`)
  }

  return colors
}

function BudgetSummaryPage() {
  const { budgetId } = Route.useParams()
  const { mode, previousBudgetAmount } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreatingBudget, setIsCreatingBudget] = useState(false)
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);

  const { data: session, isLoading: sessionLoading } = useSession()
  const { data: allCategories } = useAllCategories()
  const userId = session?.data?.user.id

  // Get budget data
  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ['budget', budgetId],
    queryFn: async () => getBudgetById({ budgetId: parseInt(budgetId) }),
    enabled: !!budgetId,
  })

  // Get expenses for this budget
  const { data: expenses, isLoading: expensesLoading } = useAllExpenses({
    budgetId: parseInt(budgetId)
  })

  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets })
      queryClient.invalidateQueries({ queryKey: queryKeys.activeBudget(userId!) })
      navigate({ to: '/' })
    },
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

  const handleStartNewBudget = () => {
    if (!budget) return

    setIsCreatingBudget(true)
    createBudgetMutation.mutate({
      userId: userId!,
      name: `Budget - ${new Date().toLocaleDateString()}`,
      startAmount: previousBudgetAmount || parseFloat(budget.startAmount),
    })
  }

  // Process expenses data for charts
  const categoryData = useMemo(() => {
    if (!expenses) return []

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
      [] as { category: string; amount: number; count: number }[],
    )
  }, [expenses])

  const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0)
  const budgetTotal = budget ? parseFloat(budget.startAmount) : 0
  const amountLeft = budgetTotal - totalAmount
  const totalExpenses = expenses?.length || 0
  const highestCategory = categoryData.reduce((max, item) =>
    (item.amount > max.amount ? item : max),
    { category: "", amount: 0 }
  )
  const highestCategoryInfo = highestCategory.category ?
    getCategoryInfo(highestCategory.category, allCategories) :
    { label: 'None' }

  const colors = generateColors(categoryData.length)

  const pieData = categoryData.map((item, index) => ({
    name: item.category,
    value: item.amount,
    percentage: totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : '0',
    color: colors[index],
  }))

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-popover-foreground font-medium">{data.name}</p>
          <p className="text-primary">R{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">{data.percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  if (sessionLoading || budgetLoading || expensesLoading) {
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
      <StartNewBudgetModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => {
          setIsNewBudgetModalOpen(false)
          navigate({ to: "/" });
        }}
        userId={userId!}
        previousBudgetAmount={parseFloat(budget.startAmount)}
      />

      <div className="max-w-2xl mx-auto space-y-4">

        <div className="grid grid-cols-2 gap-4">

          {mode === 'new' ? (
            <Card className='p-4 col-span-2 border-primary/50 bg-primary/5'>
              <CardContent className='p-0 flex flex-col gap-2 text-center'>
                <h3 className='text-primary'>You're about to close this budget</h3>
                <p className="text-xs text-white mb-2">Once closed, no further changes can be made and a new budget period will begin.</p>
                <Button
                  onClick={() => setIsNewBudgetModalOpen(true)}
                  className="flex-1 text-black"
                >
                  Close Budget
                </Button>
              </CardContent>
            </Card>) : null}
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
                <p className="text-muted-foreground text-md">total expenses</p>
              </div>
              <p className="text-xs text-muted-foreground">Over {pieData.length} categories</p>
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

        {/* Pie Chart */}
        {categoryData.length > 0 && (
          <Card className='p-0 space-y-0 gap-0'>
            <CardHeader className='p-4 pb-0'>
              <CardTitle>Expense Breakdown</CardTitle>
              <p className="text-muted-foreground text-sm">Click to highlight in chart</p>
            </CardHeader>
            <CardContent className="p-3">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => {
                        const isSelected = selectedCategory === entry.name
                        const isOtherSelected = selectedCategory && selectedCategory !== entry.name

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={isSelected ? "#ffffff" : "transparent"}
                            strokeWidth={isSelected ? 3 : 0}
                            fillOpacity={isOtherSelected ? 0.3 : 1}
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => handleCategoryClick(entry.name)}
                          />
                        )
                      })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {pieData.map((item, index) => {
                  const categoryInfo = getCategoryInfo(item.name, allCategories)
                  return (
                    <div
                      key={item.name}
                      onClick={() => handleCategoryClick(item.name)}
                      className={`m-0 flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${selectedCategory === item.name
                        ? "bg-muted border border-border"
                        : "bg-card hover:bg-muted/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-medium">{categoryInfo.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {categoryData.find((cat) => cat.category === item.name)?.count} expense(s)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-medium">R{formatCurrency(item.value)}</p>
                        <p className="text-muted-foreground text-sm">{item.percentage}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {categoryData.length === 0 && (
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-lg font-bold mb-2">No Expenses Yet</h2>
              <p className="text-muted-foreground mb-6">Start adding expenses to see your budget breakdown.</p>
            </CardContent>
          </Card>
        )}

        {mode === 'view' && (
          <div className='w-full flex justify-center'>
            <Button
              onClick={() => setIsNewBudgetModalOpen(true)}
              className="text-black flex-1"
              variant="destructive"
            >
              Close Budget
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
