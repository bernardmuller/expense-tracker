import * as BudgetBreakdownItem from './BudgetBreakdownItem.compound'
import type { BudgetBreakdownItemProps } from './BudgetBreakdownItem.types'

export default function UnplannedBudgetBreakdownItem({
  name,
  icon,
  spentAmount,
  onClick,
}: BudgetBreakdownItemProps) {
  return (
    <BudgetBreakdownItem.Root onClick={onClick}>
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
