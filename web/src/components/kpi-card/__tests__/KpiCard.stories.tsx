import type { Meta, StoryObj } from '@storybook/react-vite'
import * as KpiCard from '../KpiCard'
import {
  generateTotalSpentKpiData,
  generateBudgetUtilizationWithinKpiData,
  generateBudgetUtilizationOverKpiData,
} from '../__mocks__/kpiCardProps.mock'
import type { KpiCardData } from '../__mocks__/kpiCardProps.factory'

const meta = {
  title: 'KPI Card',
  render: (args: KpiCardData) => (
    <KpiCard.Root>
      <KpiCard.Title>{args.label}</KpiCard.Title>
      {args.valueType === 'positive' ? (
        <KpiCard.PositiveValue>{args.value}</KpiCard.PositiveValue>
      ) : (
        <KpiCard.NegativeValue>{args.value}</KpiCard.NegativeValue>
      )}
      <KpiCard.Subtext>{args.sub}</KpiCard.Subtext>
    </KpiCard.Root>
  ),
} satisfies Meta<KpiCardData>

export default meta
type Story = StoryObj<KpiCardData>

export const TotalSpent: Story = {
  args: generateTotalSpentKpiData(),
}

export const WithinBudget: Story = {
  args: generateBudgetUtilizationWithinKpiData(),
}

export const OverBudget: Story = {
  args: generateBudgetUtilizationOverKpiData(),
}
