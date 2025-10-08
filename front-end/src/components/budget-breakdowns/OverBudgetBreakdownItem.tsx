import { BudgetBreakdownItem } from './BudgetBreakdownItem'
import type { OverBudgetBreakdownItemProps } from './types'

export default function OverBudgetBreakdownItem({
  name,
  icon,
  plannedAmount,
  spentAmount,
}: OverBudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem>
      <BudgetBreakdownItem.Header name={name} icon={icon}>
        <BudgetBreakdownItem.OverBudget />
      </BudgetBreakdownItem.Header>
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.OverBudgetProgress />
        <BudgetBreakdownItem.ReverseRow>
          <BudgetBreakdownItem.Spent amount={spentAmount} />
          <BudgetBreakdownItem.Planned amount={plannedAmount} />
        </BudgetBreakdownItem.ReverseRow>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem>
  )
}
