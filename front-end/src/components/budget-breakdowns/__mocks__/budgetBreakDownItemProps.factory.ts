import { faker } from '@faker-js/faker'
import type {
  BudgetBreakdownItemProps,
  OverBudgetBreakdownItemProps,
  PlannedBudgetBreakdownItemProps,
} from '../BudgetBreakdownItem.types'
import { supportedLocales } from '@/lib/constants/supportedLocales'
import { formatCurrency } from '@/lib/utils/formatCurrency'

const BUDGET_NAMES = [
  'Groceries',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Dining Out',
  'Travel',
  'Education',
  'Fitness',
] as const

const plannedAmount = faker.number.int({ min: 0, max: 20000 })
const spentAmount = faker.number.int({ min: 0, max: plannedAmount })
const percentage = Number(((spentAmount / plannedAmount) * 100).toFixed(0))

export const budgetBreakDownItemProps: BudgetBreakdownItemProps = {
  icon: faker.internet.emoji(),
  name: faker.helpers.arrayElement(BUDGET_NAMES),
  spentAmount: formatCurrency(plannedAmount, supportedLocales.SOUTH_AFRICA),
}

export const overBudgetBreakDownItemProps: OverBudgetBreakdownItemProps = {
  icon: faker.internet.emoji(),
  name: faker.helpers.arrayElement(BUDGET_NAMES),
  spentAmount: formatCurrency(plannedAmount, supportedLocales.SOUTH_AFRICA),
  plannedAmount: formatCurrency(plannedAmount, supportedLocales.SOUTH_AFRICA),
}

export const plannedBudgetBreakDownItemProps: PlannedBudgetBreakdownItemProps =
  {
    ...budgetBreakDownItemProps,
    percentage: percentage,
    plannedAmount: formatCurrency(plannedAmount, supportedLocales.SOUTH_AFRICA),
  }
