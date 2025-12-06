import { InsightCard } from '@/components/insight-card/InsightCard'
import { requireAuth } from '@/lib/auth/route-guard'
import { getBudgetByIdQueryOptions } from '@/lib/http/queries/budget-detail'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { BudgetDetailSkeleton } from './budgets.skeleton'
import PlannedBudgetBreakdownItem from '@/components/budget-breakdowns/PlannedBudgetBreakdownItem'
import OverBudgetBreakdownItem from '@/components/budget-breakdowns/OverBudgetBreakdownItem'
import UnplannedBudgetBreakdownItem from '@/components/budget-breakdowns/UnplannedBudgetBreakdownItem'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const Route = createFileRoute('/budgets/$id/')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getBudgetByIdQueryOptions(params.id),
    )
  },
  component: BudgetDetailPage,
})

function BudgetDetailPage() {
  return (
    <Suspense fallback={<BudgetDetailSkeleton />}>
      <BudgetDetail />
    </Suspense>
  )
}

function BudgetDetail() {
  const { id } = Route.useParams()
  const { data: budget } = useSuspenseQuery(getBudgetByIdQueryOptions(id))

  const currentAmount = parseFloat(budget.currentAmount)
  const startAmount = parseFloat(budget.startAmount)
  const spentAmount = startAmount - currentAmount
  const expenseCount = budget.expenses.length

  const categories = budget.categoryBreakdown || []

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <h1 className="text-2xl font-bold">{budget.name}</h1>
        <p className="text-muted-foreground text-sm">Budget Details</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <InsightCard
              title="Current Amount"
              value={formatCurrency(currentAmount, 'za')}
            />
            <InsightCard
              title="Total Expenses"
              value={expenseCount.toString()}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Category Breakdown</h2>
            {categories.length === 0 && (
              <div className="text-muted-foreground p-8 text-center text-sm">
                No category breakdowns available
              </div>
            )}
            {categories.length > 0 && (
              <div className="grid gap-4">
                {categories
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((category) => {
                    const spent = parseFloat(category.spent)
                    const allocated = category.allocated
                      ? parseFloat(category.allocated)
                      : null

                    const hasAllocation = allocated !== null && allocated > 0
                    const isOverBudget = hasAllocation && spent > allocated!
                    const isUnplanned = !hasAllocation && spent > 0

                    if (isUnplanned) {
                      return (
                        <UnplannedBudgetBreakdownItem
                          key={category.id}
                          name={category.label}
                          icon={category.icon}
                          spentAmount={formatCurrency(spent, 'za')}
                        />
                      )
                    }
                    if (isOverBudget) {
                      return (
                        <OverBudgetBreakdownItem
                          key={category.id}
                          name={category.label}
                          icon={category.icon}
                          plannedAmount={formatCurrency(allocated!, 'za')}
                          spentAmount={formatCurrency(spent, 'za')}
                        />
                      )
                    }
                    const percentage = hasAllocation
                      ? (spent / allocated!) * 100
                      : 0
                    return (
                      <PlannedBudgetBreakdownItem
                        key={category.id}
                        name={category.label}
                        icon={category.icon}
                        percentage={percentage}
                        plannedAmount={formatCurrency(allocated!, 'za')}
                        spentAmount={formatCurrency(spent, 'za')}
                      />
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
