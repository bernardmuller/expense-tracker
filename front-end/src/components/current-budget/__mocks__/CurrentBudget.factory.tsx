import { faker } from '@faker-js/faker'
import type { CurrentBudgetProps } from '../CurrentBudget.types'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { calculateSpentPercentage } from '@/lib/utils/calculations/calculateSpentPercentage'

const startingAmount = faker.number.int({ min: 9000, max: 199999 })
const spentAmount = faker.number.int({ min: 0, max: startingAmount })
const currentAmount = startingAmount - spentAmount

export const currentBudgetProps: CurrentBudgetProps = {
  budgetName: faker.lorem.words(2),
  startingAmount: formatCurrency(startingAmount, 'za'),
  spentAmount: formatCurrency(spentAmount, 'za'),
  spentPercentage: calculateSpentPercentage(startingAmount, spentAmount),
  currentAmount: formatCurrency(currentAmount, 'za'),
  onClick: () => {
    console.log()
  },
  linkProvider: ({ children }: { children: React.ReactNode }) => (
    <a href="/">{children}</a>
  ),
}
