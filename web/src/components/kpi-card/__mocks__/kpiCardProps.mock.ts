import type { KpiCardData } from './kpiCardProps.factory'
import {
  kpiCardDataDefault,
  totalSpentKpi,
  budgetUtilizationWithinKpi,
  budgetUtilizationOverKpi,
  overBudgetMonthsLowKpi,
  overBudgetMonthsHighKpi,
} from './kpiCardProps.factory'

export const generateKpiCardData = (
  overwrites: Partial<KpiCardData> = {},
): KpiCardData => ({
  ...kpiCardDataDefault,
  ...overwrites,
})

export const generateTotalSpentKpiData = (
  overwrites: Partial<KpiCardData> = {},
): KpiCardData => ({
  ...totalSpentKpi,
  ...overwrites,
})

export const generateBudgetUtilizationWithinKpiData = (
  overwrites: Partial<KpiCardData> = {},
): KpiCardData => ({
  ...budgetUtilizationWithinKpi,
  ...overwrites,
})

export const generateBudgetUtilizationOverKpiData = (
  overwrites: Partial<KpiCardData> = {},
): KpiCardData => ({
  ...budgetUtilizationOverKpi,
  ...overwrites,
})

export const generateOverBudgetMonthsLowKpiData = (
  overwrites: Partial<KpiCardData> = {},
): KpiCardData => ({
  ...overBudgetMonthsLowKpi,
  ...overwrites,
})

export const generateOverBudgetMonthsHighKpiData = (
  overwrites: Partial<KpiCardData> = {},
): KpiCardData => ({
  ...overBudgetMonthsHighKpi,
  ...overwrites,
})
