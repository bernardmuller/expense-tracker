import { format } from 'date-fns'
import type {
  CategoryChartProps,
  MonthlyChartData,
} from '../CategoryChart.types'

const underBudgetData: Array<MonthlyChartData> = [
  { month: format(new Date('2025-10-01'), 'MMM'), spent: 350, budget: 500 },
  { month: format(new Date('2025-11-01'), 'MMM'), spent: 450, budget: 600 },
  { month: format(new Date('2025-12-01'), 'MMM'), spent: 320, budget: 400 },
  { month: format(new Date('2026-01-01'), 'MMM'), spent: 0, budget: 200 },
  { month: format(new Date('2026-02-01'), 'MMM'), spent: 129, budget: 300 },
  { month: format(new Date('2026-03-01'), 'MMM'), spent: 150, budget: 200 },
]

const overBudgetData: Array<MonthlyChartData> = [
  { month: format(new Date('2025-10-01'), 'MMM'), spent: 789, budget: 500 },
  { month: format(new Date('2025-11-01'), 'MMM'), spent: 700, budget: 600 },
  { month: format(new Date('2025-12-01'), 'MMM'), spent: 527, budget: 400 },
  { month: format(new Date('2026-01-01'), 'MMM'), spent: 250, budget: 200 },
  { month: format(new Date('2026-02-01'), 'MMM'), spent: 450, budget: 300 },
  { month: format(new Date('2026-03-01'), 'MMM'), spent: 478, budget: 200 },
]

const mixedBudgetData: Array<MonthlyChartData> = [
  { month: format(new Date('2025-10-01'), 'MMM'), spent: 789, budget: 500 },
  { month: format(new Date('2025-11-01'), 'MMM'), spent: 300, budget: 600 },
  { month: format(new Date('2025-12-01'), 'MMM'), spent: 527, budget: 400 },
  { month: format(new Date('2026-01-01'), 'MMM'), spent: 0, budget: 200 },
  { month: format(new Date('2026-02-01'), 'MMM'), spent: 129, budget: 300 },
  { month: format(new Date('2026-03-01'), 'MMM'), spent: 478, budget: 200 },
]

export const categoryChartPropsUnderBudget: CategoryChartProps = {
  data: underBudgetData,
  categoryName: 'Groceries',
  description: 'Monthly spent vs Allocated Budget',
  currency: 'R',
}

export const categoryChartPropsOverBudget: CategoryChartProps = {
  data: overBudgetData,
  categoryName: 'Entertainment',
  description: 'Monthly spent vs Allocated Budget',
  currency: 'R',
}

export const categoryChartPropsMixed: CategoryChartProps = {
  data: mixedBudgetData,
  categoryName: 'Transportation',
  description: 'Monthly spent vs Allocated Budget',
  currency: 'R',
}

export const categoryChartPropsDefault: CategoryChartProps =
  categoryChartPropsMixed
