import {
  Bar,
  XAxis,
  LabelList,
  ComposedChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { LabelProps } from 'recharts'
import { Card, CardContent, CardHeader } from '../ui/card'
import type { CategoryChartProps } from './CategoryChart.types'

const CHART_COLORS = {
  underBudget: '#3fa681',
  underBudgetGradientStart: '#5ee8b0',
  underBudgetGradientEnd: '#2cb87d',
  overBudget: '#ff6b6b',
  overBudgetGradientStart: '#ff6b6b',
  overBudgetGradientEnd: '#c73b3b',
  budgetLine: '#f5c842',
  gridStroke: '#444',
  axisText: '#555',
  labelText: '#fff',
  legendText: '#666',
} as const

type LegendItem = {
  color: string
  label: string
  shape: 'bar' | 'line'
}

type ChartLegendProps = {
  items: Array<LegendItem>
}

function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.shape === 'bar' ? (
            <div
              className="h-3 w-3 rounded opacity-85"
              style={{ backgroundColor: item.color }}
            />
          ) : (
            <div
              className="relative h-0.5 w-[18px] rounded"
              style={{ backgroundColor: item.color }}
            >
              <div
                className="absolute -top-0.5 left-1/2 h-1.5 w-1.5
                  -translate-x-1/2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          )}
          <span className="font-sans text-[11px] tracking-wider text-[#666]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

const createLabelRenderer = (currency: string) => (props: LabelProps) => {
  const { x, y, width, value } = props

  if (x == null || y == null || width == null) {
    return null
  }
  const radius = 10

  return (
    <text
      x={Number(x) + Number(width) / 2}
      y={Number(y) - radius}
      fill={CHART_COLORS.labelText}
      textAnchor="middle"
      dominantBaseline="middle"
      className="font-sans text-xs"
    >
      {currency} {String(value)}
    </text>
  )
}

export default function CategoryChart({
  data,
  categoryName,
  description = 'Monthly spent vs Allocated Budget',
  currency = 'R',
  activeIndex,
  onBarClick,
  onBlur,
}: CategoryChartProps) {
  const legendItems: Array<LegendItem> = [
    { color: CHART_COLORS.underBudget, label: 'Under Budget', shape: 'bar' },
    { color: CHART_COLORS.overBudget, label: 'Over Budget', shape: 'bar' },
    { color: CHART_COLORS.budgetLine, label: 'Budget Line', shape: 'line' },
  ]

  return (
    <Card onClick={onBlur}>
      <CardHeader>
        <h2 className="font-grotesk text-lg leading-4 font-semibold">
          {categoryName}
        </h2>
        <p className="text-muted-foreground font-sans text-xs">{description}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
          >
            <defs>
              <linearGradient id="underGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.underBudgetGradientStart}
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.underBudgetGradientEnd}
                  stopOpacity={0.7}
                />
              </linearGradient>
              <linearGradient id="overGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.overBudgetGradientStart}
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.overBudgetGradientEnd}
                  stopOpacity={0.7}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={CHART_COLORS.gridStroke}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: CHART_COLORS.axisText,
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.05em',
              }}
              dy={10}
            />
            <Bar
              dataKey="spent"
              radius={[5, 5, 0, 0]}
              maxBarSize={44}
              minPointSize={5}
              onClick={(_, index) => {
                onBarClick?.(index)
              }}
              shape={(props) => {
                const { x, y, width, height, index } = props
                const entry = data[index]
                const over = entry.spent > entry.budget
                const opacity =
                  activeIndex === undefined || activeIndex === index ? 1 : 0.45
                const radius = 5
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={radius}
                    ry={radius}
                    fill={over ? 'url(#overGrad)' : 'url(#underGrad)'}
                    opacity={opacity}
                    style={{ cursor: onBarClick ? 'pointer' : 'default' }}
                  />
                )
              }}
            >
              <LabelList
                dataKey="spent"
                content={createLabelRenderer(currency)}
              />
            </Bar>
            <Line
              type="monotone"
              dataKey="budget"
              stroke={CHART_COLORS.budgetLine}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_COLORS.budgetLine, strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: CHART_COLORS.budgetLine,
                strokeWidth: 0,
              }}
              strokeDasharray="0"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <ChartLegend items={legendItems} />
      </CardContent>
    </Card>
  )
}
