import type { CategoryChartProps } from '../CategoryChart.types'
import {
  categoryChartPropsDefault,
  categoryChartPropsUnderBudget,
  categoryChartPropsOverBudget,
  categoryChartPropsMixed,
} from './categoryChartProps.factory'

export const generateCategoryChartProps = (
  overwrites: Partial<CategoryChartProps> = {},
): CategoryChartProps => ({
  ...categoryChartPropsDefault,
  ...overwrites,
})

export const generateUnderBudgetCategoryChartProps = (
  overwrites: Partial<CategoryChartProps> = {},
): CategoryChartProps => ({
  ...categoryChartPropsUnderBudget,
  ...overwrites,
})

export const generateOverBudgetCategoryChartProps = (
  overwrites: Partial<CategoryChartProps> = {},
): CategoryChartProps => ({
  ...categoryChartPropsOverBudget,
  ...overwrites,
})

export const generateMixedBudgetCategoryChartProps = (
  overwrites: Partial<CategoryChartProps> = {},
): CategoryChartProps => ({
  ...categoryChartPropsMixed,
  ...overwrites,
})
