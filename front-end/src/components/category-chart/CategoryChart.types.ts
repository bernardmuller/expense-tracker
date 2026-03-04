export type MonthlyChartData = {
  month: string
  spent?: number
  budget?: number
}

export type CategoryChartProps = {
  data: Array<MonthlyChartData>
  categoryName: string
  description?: string
  currency?: string
  activeIndex?: number
  onBarClick?: (index: number) => void
  onBlur?: () => void
}
