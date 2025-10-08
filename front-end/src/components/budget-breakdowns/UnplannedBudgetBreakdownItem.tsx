import { BudgetBreakdownItem } from './BudgetBreakdownItem'
import type { BudgetBreakdownItemProps } from './types'

export default function UnplannedBudgetBreakdownItem({
  name,
  icon,
  spentAmount,
}: BudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem>
      <BudgetBreakdownItem.Header name={name} icon={icon}>
        <BudgetBreakdownItem.Unplanned />
      </BudgetBreakdownItem.Header>
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.DisabledProgress />
        <BudgetBreakdownItem.ReverseRow>
          <BudgetBreakdownItem.Spent amount={spentAmount} />
        </BudgetBreakdownItem.ReverseRow>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem>
  )
}
