export type KpiCardData = {
  label: string
  value: string
  sub: string
  valueType: 'positive' | 'negative'
}

export const totalSpentKpi: KpiCardData = {
  label: 'Total Spent',
  value: '12.5k',
  sub: 'across 12 months',
  valueType: 'positive',
}

export const budgetUtilizationWithinKpi: KpiCardData = {
  label: 'Budget Utilization',
  value: '87%',
  sub: 'within budget',
  valueType: 'positive',
}

export const budgetUtilizationOverKpi: KpiCardData = {
  label: 'Budget Utilization',
  value: '112%',
  sub: 'over budget',
  valueType: 'negative',
}

export const overBudgetMonthsLowKpi: KpiCardData = {
  label: 'Over-Budget Months',
  value: '2',
  sub: 'months exceeded limit',
  valueType: 'positive',
}

export const overBudgetMonthsHighKpi: KpiCardData = {
  label: 'Over-Budget Months',
  value: '5',
  sub: 'months exceeded limit',
  valueType: 'negative',
}

export const kpiCardDataDefault: KpiCardData = budgetUtilizationWithinKpi
