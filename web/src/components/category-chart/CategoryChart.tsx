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
import { useState } from 'react'

const CHART_COLORS = {
  underBudget: '#3fa681',
  underBudgetLight: '#8fddbb',
  underBudgetLip: '#2f8f6f',
  overBudget: '#ff6b6b',
  overBudgetLight: '#ffb0a8',
  overBudgetLip: '#d9534f',
  budgetLine: '#f5c842',
  budgetLineLip: '#c79a2e',
  gridStroke: '#444',
  axisText: '#555',
  legendText: '#666',
} as const

type LegendItem = {
  color: string
  lip: string
  label: string
  shape: 'bar' | 'line'
}

type ChartLegendProps = {
  items: Array<LegendItem>
}

function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="flex w-full items-center gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-1 items-end justify-center gap-2 min-h-5"
        >
          {item.shape === 'bar' ? (
            <div
              className="h-4 w-5 rounded-[5px]"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 3px 0 ${item.lip}, 0 1px 0 ${item.lip}`,
                marginBottom: 4,
              }}
            />
          ) : (
            <div
              className="h-2 w-7 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 2px 0 ${item.lip}`,
                marginBottom: 5,
              }}
            />
          )}
          <span className="font-sans text-xs text-[#666]">
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
      fill="currentColor"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-foreground font-sans text-xs"
    >
      {currency} {String(Math.floor(Number(value)))}
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const legendItems: Array<LegendItem> = [
    {
      color: CHART_COLORS.underBudget,
      lip: CHART_COLORS.underBudgetLip,
      label: 'Under',
      shape: 'bar',
    },
    {
      color: CHART_COLORS.overBudget,
      lip: CHART_COLORS.overBudgetLip,
      label: 'Over',
      shape: 'bar',
    },
    {
      color: CHART_COLORS.budgetLine,
      lip: CHART_COLORS.budgetLineLip,
      label: 'Budget',
      shape: 'line',
    },
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
        <div
          className="bg-muted rounded-2xl px-3 pt-2 pb-3
            [box-shadow:var(--input-groove),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_2px_rgba(0,0,0,0.08)]"
        >
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
            >
              <defs>
                <linearGradient id="barGloss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="white" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke={CHART_COLORS.gridStroke}
                strokeOpacity={0.25}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{
                  stroke: CHART_COLORS.gridStroke,
                  strokeDasharray: '3 3',
                }}
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
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(data, index) => {
                  onBarClick?.(data, index)
                }}
                shape={(props) => {
                  const { x, y, width, height, index, payload } = props
                  const over = Number(payload.spent) > Number(payload.budget)

                  const isLit =
                    hoveredIndex !== null
                      ? hoveredIndex === index
                      : activeIndex === index

                  const radius = 3
                  const baseLip = 5
                  const lip = isLit ? 7 : baseLip
                  const yPos = y - lip - 1
                  const faceFill = over
                    ? CHART_COLORS.overBudget
                    : CHART_COLORS.underBudget
                  const lipFill = over
                    ? CHART_COLORS.overBudgetLip
                    : CHART_COLORS.underBudgetLip
                  const edgeFill = over
                    ? CHART_COLORS.overBudgetLight
                    : CHART_COLORS.underBudgetLight
                  return (
                    <g style={{ cursor: onBarClick ? 'pointer' : 'default' }}>
                      <rect
                        x={x}
                        y={yPos}
                        width={width}
                        height={height + lip}
                        rx={radius}
                        ry={radius}
                        fill={lipFill}
                      />
                      <rect
                        x={x}
                        y={yPos}
                        width={width}
                        height={height}
                        rx={radius}
                        ry={radius}
                        fill={faceFill}
                        stroke={isLit ? edgeFill : 'none'}
                        strokeWidth={2}
                      >
                        <rect
                          x={0}
                          y={0}
                          width={width}
                          height={height}
                          rx={radius}
                          ry={radius}
                          fill="url(#barGloss)"
                        />
                        {isLit && (
                          <rect
                            x={0}
                            y={0}
                            width={width}
                            height={2.5}
                            rx={Math.min(radius, 2)}
                            fill="white"
                            opacity={0.9}
                          />
                        )}
                      </rect>
                    </g>
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
        </div>
        <div className="mt-3">
          <ChartLegend items={legendItems} />
        </div>
      </CardContent>
    </Card>
  )
}
