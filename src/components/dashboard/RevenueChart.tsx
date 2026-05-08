'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'

const BarChart = dynamic(() => import('recharts').then((m) => m.BarChart), {
  ssr: false,
})
const Bar = dynamic(() => import('recharts').then((m) => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), {
  ssr: false,
})
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), {
  ssr: false,
})
const CartesianGrid = dynamic(
  () => import('recharts').then((m) => m.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), {
  ssr: false,
})
const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
)

// Dummy baseline chart data — always populated so chart never looks empty
const chartData = [
  { month: 'Jul', revenue: 62000, expenses: 41000 },
  { month: 'Aug', revenue: 75000, expenses: 48000 },
  { month: 'Sep', revenue: 68000, expenses: 44000 },
  { month: 'Oct', revenue: 82000, expenses: 52000 },
  { month: 'Nov', revenue: 79000, expenses: 49000 },
  { month: 'Dec', revenue: 91000, expenses: 57000 },
  { month: 'Jan', revenue: 94210, expenses: 61000 },
]

interface RevenueChartProps {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
}

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

export default function RevenueChart({
  totalRevenue,
  totalExpenses,
  netProfit,
}: RevenueChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.2 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6
        hover:border-white/[0.10] transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Revenue Overview</h2>
          <p className="text-white/40 text-sm mt-0.5">
            Last 7 months performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-white/50 text-xs">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="text-white/50 text-xs">Expenses</span>
          </div>
          <div
            className="ml-3 flex items-center gap-1 bg-emerald-500/10
            text-emerald-400 text-xs px-2.5 py-1 rounded-full"
          >
            <TrendingUp className="w-3 h-3" />
            <span>+18.4%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barGap={4}
              barCategoryGap="30%"
              margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
        ) : (
          <div className="h-full w-full flex items-end justify-between gap-2 pb-6 px-2">
            {[62, 75, 68, 82, 79, 91, 94].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/[0.04] rounded-t-lg animate-pulse"
                style={{ height: `${(h / 100) * 70}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary row — uses real merged totals from props */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
        {[
          {
            label: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            color: 'text-indigo-400',
          },
          {
            label: 'Total Expenses',
            value: `$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            color: 'text-white/60',
          },
          {
            label: 'Net Profit',
            value: `$${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            color: 'text-emerald-400',
          },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-white/30 text-xs mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
