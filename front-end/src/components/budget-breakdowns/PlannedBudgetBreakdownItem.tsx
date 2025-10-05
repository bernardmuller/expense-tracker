import { BudgetBreakdownItem } from './BudgetBreakdownItem'
import type { PlannedBudgetBreakdownItemProps } from './types'

export default function PlannedBudgetBreakdownItem({
  name,
  icon,
  percentage,
  plannedAmount,
  spentAmount,
}: PlannedBudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem>
      <BudgetBreakdownItem.Header name={name} icon={icon} />
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.Progress percentage={percentage} />
        <BudgetBreakdownItem.Row>
          <BudgetBreakdownItem.Planned amount={plannedAmount} />
          <BudgetBreakdownItem.Spent amount={spentAmount} />
        </BudgetBreakdownItem.Row>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem>
  )
}
