import { BudgetBreakdownItem } from './BudgetBreakdownItem'
import type { DefaultBudgetBreakdownItemProps } from './types'

export default function DefaultBudgetBreakdownItem({
  name,
  icon,
  percentage,
  spentAmount,
}: DefaultBudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem>
      <BudgetBreakdownItem.Header name={name} icon={icon} />
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.Progress percentage={percentage} />
        <BudgetBreakdownItem.Row>
          <BudgetBreakdownItem.Spent amount={spentAmount} />
        </BudgetBreakdownItem.Row>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem>
  )
}
