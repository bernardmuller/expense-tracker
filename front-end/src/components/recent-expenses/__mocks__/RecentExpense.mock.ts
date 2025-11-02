import type { RecentExpenseProps } from '../RecentExpense.types'
import { recentExpenseProps } from './RecentExpense.factory'

export const generateRecentExpenseProps = (
  overwrites: Partial<RecentExpenseProps> = {},
) => ({
  ...recentExpenseProps,
  ...overwrites,
})
