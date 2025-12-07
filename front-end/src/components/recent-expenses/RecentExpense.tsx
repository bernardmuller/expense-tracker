import type { RecentExpenseProps } from './RecentExpense.types'

export default function RecentExpense({
  description,
  amount,
  emoji,
  categoryLabel,
}: RecentExpenseProps) {
  return (
    <div className="flex items-center justify-between py-2 pr-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full
            bg-muted"
        >
          <span className="text-lg">{emoji}</span>
        </div>
        <div>
          <div className="text-sm font-medium">{description}</div>
          <div className="text-muted-foreground text-xs">{categoryLabel}</div>
        </div>
      </div>
      <div className="text-sm font-semibold">{amount}</div>
    </div>
  )
}
