import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'

type BudgetBreakdownItemProps = {
  key: string
  name: string
  icon: string
  planned?: number
  spent: number
  percentage: number
  isOverBudget: boolean
  isUnplanned: boolean
  onClick: () => void
}

export default function BudgetBreakdownItem({
  name,
  icon,
  planned,
  spent,
  percentage,
  isOverBudget = false,
  isUnplanned = false,
  onClick,
}: BudgetBreakdownItemProps) {
  return (
    <Card
      className="border-border/50 cursor-pointer p-4"
      onClick={() => onClick()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <h3 className="text-foreground text-lg font-semibold">{name}</h3>
        </div>
        {isOverBudget && <Badge variant="destructive">Over budget</Badge>}
        {isUnplanned && <Badge variant="outline">Unplanned</Badge>}
      </div>
      <div className="space-y-2">
        <Progress
          value={percentage}
          className="h-1"
          // isError={isOverBudget}
        />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Planned: R{planned?.toLocaleString() ?? '0'}
          </span>
          <span className="text-muted-foreground font-sm">
            Spent:{' '}
            <span className="text-primary font-semibold">
              R{spent.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </Card>
  )
}
