import * as BudgetBreakdownItem from './BudgetBreakdownItem'
import type { BudgetBreakdownItemProps } from './BudgetBreakdownItem.types'

export default function UnplannedBudgetBreakdownItem({
  name,
  icon,
  spentAmount,
}: BudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem.Root>
      <BudgetBreakdownItem.Header name={name} icon={icon}>
        <BudgetBreakdownItem.UnplannedBadge />
      </BudgetBreakdownItem.Header>
      <BudgetBreakdownItem.Stats>
        <BudgetBreakdownItem.DisabledProgressBar />
        <BudgetBreakdownItem.ReverseRow>
          <BudgetBreakdownItem.Spent amount={spentAmount} />
        </BudgetBreakdownItem.ReverseRow>
      </BudgetBreakdownItem.Stats>
    </BudgetBreakdownItem.Root>
  )
}
