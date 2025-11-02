import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { faker } from '@faker-js/faker'
import type { RecentExpenseProps } from '../RecentExpense.types'

const recentExpenseAmount = formatCurrency(
  faker.number.int({ min: 100, max: 2000 }),
  'za',
)

export const recentExpenseProps: RecentExpenseProps = {
  amount: recentExpenseAmount,
  description: faker.lorem.words({ min: 1, max: 3 }),
  emoji: faker.internet.emoji(),
}
