import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import type { AllExpensesProps } from './AllExpenses.types'

export default function AllExpenses({
  budgetName,
  children,
}: AllExpensesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>{budgetName}</CardDescription>
      </CardHeader>
      <CardContent className="divide-border divide-y">{children}</CardContent>
    </Card>
  )
}
