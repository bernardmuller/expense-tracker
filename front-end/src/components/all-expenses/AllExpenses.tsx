import { Button } from '../ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'
import type { AllExpensesProps } from './AllExpenses.types'

export default function AllExpenses({
  budgetName,
  children,
  linkProvider: LinkProvider,
}: AllExpensesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses - {budgetName}</CardTitle>
        <CardAction>
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <LinkProvider>Back to Dashboard</LinkProvider>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="divide-border divide-y">{children}</CardContent>
    </Card>
  )
}
