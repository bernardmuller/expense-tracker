export type RecentExpenseProps = {
  description: string
  amount: string
  emoji: string
  categoryLabel: string
  onDelete?: () => void
  createdAt: string
}
