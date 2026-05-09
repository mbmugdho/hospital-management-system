'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const chartData = [
  { month: 'Jul', revenue: 62000, expenses: 41000 },
  { month: 'Aug', revenue: 75000, expenses: 48000 },
  { month: 'Sep', revenue: 68000, expenses: 44000 },
  { month: 'Oct', revenue: 82000, expenses: 52000 },
  { month: 'Nov', revenue: 79000, expenses: 49000 },
  { month: 'Dec', revenue: 91000, expenses: 57000 },
  { month: 'Jan', revenue: 94210, expenses: 61000 },
]

interface TooltipPayload {
  value: number
  name: string
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-3 shadow-2xl">
      <p className="text-white/50 text-xs mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white/70 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

// Entire Recharts tree in one component — loaded only client side
export default function RevenueChartInner() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        barGap={4}
        barCategoryGap="30%"
        margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6366F1" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar
          dataKey="expenses"
          fill="rgba(255,255,255,0.08)"
          radius={[6, 6, 0, 0]}
          name="expenses"
        />
        <Bar
          dataKey="revenue"
          fill="url(#revenueGradient)"
          radius={[6, 6, 0, 0]}
          name="revenue"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
