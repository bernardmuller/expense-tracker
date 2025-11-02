import type { RecentExpenseProps } from './RecentExpense.types'

export default function RecentExpense({
  description,
  amount,
  emoji,
}: RecentExpenseProps) {
  return (
    <div
      className="border-border flex items-center justify-between border-b py-2
        last:border-b-0"
    >
      <div className="flex items-center gap-3">
        {emoji && (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full
              text-lg"
          >
            {emoji}
          </span>
        )}
        <span className="font-medium">{description}</span>
      </div>
      <span className="font-semibold">{amount}</span>
    </div>
  )
}
