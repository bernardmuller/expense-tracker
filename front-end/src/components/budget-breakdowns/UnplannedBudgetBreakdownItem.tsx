import { BudgetBreakdownItem } from './BudgetBreakdownItem'
import type { BudgetBreakdownItemProps } from './BudgetBreakdownItem.types'

export default function UnplannedBudgetBreakdownItem({
  name,
  icon,
  spentAmount,
}: BudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem>
      <BudgetBreakdownItem.Header name={name} icon={icon}>
        <BudgetBreakdownItem.UnplannedBadge />
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
