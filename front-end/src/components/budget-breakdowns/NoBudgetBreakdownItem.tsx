import { Card, CardContent } from '../ui/card'

export function NoBudgetBreakdownItem() {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="mb-4 text-4xl">📊</div>
        <h2 className="text-md mb-2 font-bold">No Expenses Yet</h2>
        <p className="text-muted-foreground mx-auto max-w-60 text-sm">
          Start adding expenses to see your budget breakdown.
        </p>
      </CardContent>
    </Card>
  )
}
