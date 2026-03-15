export type MonthlyChartData = {
  month: string
  spent?: number
  budget?: number
  budgetId?: string
  period?: string
}

export type CategoryChartProps = {
  data: Array<MonthlyChartData>
  categoryName: string
  description?: string
  currency?: string
  activeIndex?: number
  onBarClick?: (data: MonthlyChartData, index: number) => void
  onBlur?: () => void
}
