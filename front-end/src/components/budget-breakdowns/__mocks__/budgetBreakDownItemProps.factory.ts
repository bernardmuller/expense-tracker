import { faker } from "@faker-js/faker";
import type { BudgetBreakdownItemProps } from "../types";
import { getRandomBool } from "@/lib/utils";

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
      'Fitness'
] as const

const plannedAmount = faker.number.int({min: 0, max: 20000})
const spentAmount = faker.number.int({min:0, max: plannedAmount})
const percentage = Number(((spentAmount / plannedAmount) * 100).toFixed(0))

export const budgetBreakDownItemProps: BudgetBreakdownItemProps = ({
  icon: faker.internet.emoji(),
  name: faker.helpers.arrayElement(BUDGET_NAMES),
  planned: plannedAmount,
  spent: spentAmount,
  percentage: percentage,
  isOverBudget: false,
  isUnplanned: getRandomBool(),
  onClick: () => {}
})
