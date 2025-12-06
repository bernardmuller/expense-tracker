import { Button } from '../ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>{budgetName}</CardDescription>
        <CardAction>
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <LinkProvider>View Budget</LinkProvider>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="divide-border divide-y">{children}</CardContent>
    </Card>
  )
}
