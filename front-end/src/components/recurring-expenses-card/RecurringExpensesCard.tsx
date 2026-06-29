import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  children: React.ReactNode
}

export default function RecurringExpensesCard({ children }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-border divide-y">{children}</ul>
      </CardContent>
    </Card>
  )
}
