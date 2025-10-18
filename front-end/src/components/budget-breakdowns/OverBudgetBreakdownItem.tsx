import * as BudgetBreakdownItem from './BudgetBreakdownItem'
import type { OverBudgetBreakdownItemProps } from './BudgetBreakdownItem.types'

export default function OverBudgetBreakdownItem({
  name,
  icon,
  plannedAmount,
  spentAmount,
}: OverBudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem.Root>
      <BudgetBreakdownItem.Header name={name} icon={icon}>
        <BudgetBreakdownItem.OverBudgetBadge />
      </BudgetBreakdownItem.Header>
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.OverBudgetProgressBar />
        <BudgetBreakdownItem.ReverseRow>
          <BudgetBreakdownItem.Spent amount={spentAmount} />
          <BudgetBreakdownItem.Planned amount={plannedAmount} />
        </BudgetBreakdownItem.ReverseRow>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem.Root>
  )
}
