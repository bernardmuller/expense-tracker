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
import { useState } from 'react'
import type { CategoryChartProps } from './CategoryChart.types'

const PRIMARY_COLOR = '#3fa681'

const renderCustomizedLabel = (props: LabelProps) => {
  const { x, y, width, value } = props

  if (x == null || y == null || width == null) {
    return null
  }
  const radius = 10

  return (
    <text
      x={Number(x) + Number(width) / 2}
      y={Number(y) - radius}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs"
    >
      R {String(value)}
    </text>
  )
}

export default function CategoryChart({
  data,
  categoryName,
  description = 'Monthly spent vs Allocated Budget',
}: CategoryChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg leading-4">{categoryName}</h2>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              <linearGradient id="underGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5ee8b0" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2cb87d" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="overGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#c73b3b" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#444"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#555',
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.05em',
              }}
              dy={10}
            />
            <Bar
              dataKey="spent"
              radius={[5, 5, 0, 0]}
              maxBarSize={44}
              onMouseEnter={(_, idx) => setHovered(idx)}
              minPointSize={5}
              shape={(props) => {
                const { x, y, width, height, index } = props
                const entry = data[index]
                const over = entry.spent > entry.budget
                const opacity = hovered === null || hovered === index ? 1 : 0.45
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
                  />
                )
              }}
            >
              <LabelList dataKey="spent" content={renderCustomizedLabel} />
            </Bar>
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#f5c842"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f5c842', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#f5c842', strokeWidth: 0 }}
              strokeDasharray="0"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2">
          {[
            { color: PRIMARY_COLOR, label: 'Under Budget', shape: 'bar' },
            { color: '#ff6b6b', label: 'Over Budget', shape: 'bar' },
            { color: '#f5c842', label: 'Budget Line', shape: 'line' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              {l.shape === 'bar' ? (
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    background: l.color,
                    opacity: 0.85,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '18px',
                    height: '2px',
                    background: l.color,
                    borderRadius: '2px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: l.color,
                    }}
                  />
                </div>
              )}
              <span
                style={{
                  color: '#666',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
