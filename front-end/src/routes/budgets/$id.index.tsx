import { requireAuth } from '@/lib/auth/route-guard'
import { getBudgetByIdQueryOptions } from '@/lib/http/queries/budget-detail'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  useNavigate,
  Link,
  useRouter,
} from '@tanstack/react-router'
import React, { Suspense } from 'react'
import { BudgetDetailSkeleton } from './budgets.skeleton'
import PlannedBudgetBreakdownItem from '@/components/budget-breakdowns/PlannedBudgetBreakdownItem'
import OverBudgetBreakdownItem from '@/components/budget-breakdowns/OverBudgetBreakdownItem'
import UnplannedBudgetBreakdownItem from '@/components/budget-breakdowns/UnplannedBudgetBreakdownItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CurrentBudgetWithoutAction } from '@/components/current-budget/CurrentBudget'
import { Button } from '@/components/ui/button'
import { usePrivacy } from '@/lib/hooks/usePrivacy'
import { getPrivacyDisplayValue } from '@/lib/utils/formatting/getPrivacyDisplayValue'
import { AppHeader } from '@/components/app-header'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NavigationLink } from '@/components/navigation-link/NavigationLink'
import { Plus, ReceiptText } from 'lucide-react'
import { Layout } from '@/components/layouts/Layout'

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
  const router = useRouter()
  const navigate = useNavigate()
  const { data: budget } = useSuspenseQuery(getBudgetByIdQueryOptions(id))
  const { isPrivacyEnabled, togglePrivacy } = usePrivacy()

  const currentAmount = Math.floor(parseFloat(budget.currentAmount))
  const startAmount = Math.floor(parseFloat(budget.startAmount))
  const spentAmount = startAmount - currentAmount
  const spentPercentage = (spentAmount / startAmount) * 100

  const categories = budget.categoryBreakdown

  const handleCategoryClick = (categoryLabel: string) => {
    navigate({
      to: '/budgets/$id/expenses',
      params: { id },
      search: { category: categoryLabel },
    })
  }

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back onBack={() => navigate({ to: '/dashboard' })} />
        </AppHeader.Left>
        <AppHeader.Center>
          <AppHeader.Title>Budget</AppHeader.Title>
        </AppHeader.Center>
        <AppHeader.Right>
          <ThemeToggle />
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground
              aspect-square"
            onClick={() => router.navigate({ to: '/budgets/new' })}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">New Budget</span>
          </Button>
        </AppHeader.Right>
      </AppHeader.Root>
      <Layout>
        <CurrentBudgetWithoutAction
          budgetName={budget.name}
          currentAmount={getPrivacyDisplayValue(
            formatCurrency(currentAmount, 'za'),
            isPrivacyEnabled,
          )}
          startingAmount={getPrivacyDisplayValue(
            formatCurrency(startAmount, 'za'),
            isPrivacyEnabled,
          )}
          spentAmount={getPrivacyDisplayValue(
            formatCurrency(spentAmount, 'za'),
            isPrivacyEnabled,
          )}
          spentPercentage={spentPercentage}
          onClick={togglePrivacy}
        />
        <Card className="p-0">
          <NavigationLink
            icon={<ReceiptText className="h-5 w-5 text-white" />}
            title={`${budget.expenses.length} Expenses`}
            subtitle={`Across ${categories.length} categories`}
            linkProvider={({ children }) => (
              <Link to="/budgets/$id/expenses" params={{ id }}>
                {children}
              </Link>
            )}
            variant="primary"
          />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
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
                      const isOverBudget = hasAllocation && spent > allocated
                      const isUnplanned = !hasAllocation && spent > 0

                      if (isUnplanned) {
                        return (
                          <UnplannedBudgetBreakdownItem
                            name={category.label}
                            icon={category.icon}
                            spentAmount={formatCurrency(spent, 'za')}
                            onClick={() => handleCategoryClick(category.label)}
                          />
                        )
                      }
                      if (isOverBudget) {
                        return (
                          <OverBudgetBreakdownItem
                            name={category.label}
                            icon={category.icon}
                            plannedAmount={formatCurrency(allocated, 'za')}
                            spentAmount={formatCurrency(spent, 'za')}
                            onClick={() => handleCategoryClick(category.label)}
                          />
                        )
                      }
                      const percentage = hasAllocation
                        ? (spent / allocated) * 100
                        : 0
                      return (
                        <PlannedBudgetBreakdownItem
                          name={category.label}
                          icon={category.icon}
                          percentage={percentage}
                          plannedAmount={formatCurrency(allocated!, 'za')}
                          spentAmount={formatCurrency(spent, 'za')}
                          onClick={() => handleCategoryClick(category.label)}
                        />
                      )
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Layout>
    </>
  )
}
