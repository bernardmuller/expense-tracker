import { Link } from '@tanstack/react-router'
import type { RecentExpensesByBudgetId } from '@/server/queries/expenses'
import type { CategoriesByUserId } from '@/server/queries/categories'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { getCategoryInfo } from '@/lib/category-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface RecentExpensesProps {
  currencySymbol: string
  expenses: RecentExpensesByBudgetId
  categories: CategoriesByUserId
}

function NoExpensesFound() {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">📝</div>
      <p className="text-muted-foreground">No expenses yet</p>
    </div>
  )
}

function RecentExpensesList({
  currencySymbol,
  expenses,
  categories
}: RecentExpensesProps) {
  if (expenses.length === 0)
    return (
      <NoExpensesFound />
    )
  return (
    <>
      {
        expenses.map((expense) => {
          const categoryInfo = getCategoryInfo(expense.category, categories)
          const amount = parseFloat(expense.amount)

          return (
            <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className={cn("flex items-center gap-3", {
                "gap-3": !!categoryInfo.icon
              })}>
                {categoryInfo.icon && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-lg">
                    {categoryInfo.icon}
                  </span>
                )}
                <span className="font-medium">{expense.description}</span>
              </div>
              <span className="font-semibold">
                {currencySymbol}{formatCurrency(amount)}
              </span>
            </div >
          )
        })
      }
    </>
  )
}

export default function RecentExpenses({
  currencySymbol,
  expenses = [],
  categories = []
}: RecentExpensesProps) {
  if (!currencySymbol) throw new Error("RecentExpenses: no currency symbol provided")
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Expenses</CardTitle>
          <Button variant="link" asChild className="text-sm p-0 h-auto">
            <Link to="/expenses">
              View All
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RecentExpensesList
          currencySymbol={currencySymbol}
          expenses={expenses}
          categories={categories}
        />
      </CardContent>
    </Card >
  )
}
