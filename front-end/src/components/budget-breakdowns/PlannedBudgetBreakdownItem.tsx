import * as BudgetBreakdownItem from './BudgetBreakdownItem.compound'
import type { PlannedBudgetBreakdownItemProps } from './BudgetBreakdownItem.types'

export default function PlannedBudgetBreakdownItem({
  name,
  icon,
  percentage,
  plannedAmount,
  spentAmount,
  onClick,
}: PlannedBudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem.Root onClick={onClick}>
      <BudgetBreakdownItem.Header name={name} icon={icon} />
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.ProgressBar percentage={percentage} />
        <BudgetBreakdownItem.ReverseRow>
          <BudgetBreakdownItem.Spent amount={spentAmount} />
          <BudgetBreakdownItem.Planned amount={plannedAmount} />
        </BudgetBreakdownItem.ReverseRow>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem.Root>
  )
}
