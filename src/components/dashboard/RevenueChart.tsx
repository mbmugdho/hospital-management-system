'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'

// Entire chart tree loaded client-only — eliminates width -1 on navigation
const RevenueChartInner = dynamic(() => import('./RevenueChartInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-end justify-between gap-2 pb-6 px-2">
      {[62, 75, 68, 82, 79, 91, 94].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-white/[0.04] rounded-t-lg animate-pulse"
          style={{ height: `${(h / 100) * 70}%` }}
        />
      ))}
    </div>
  ),
})

interface RevenueChartProps {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
}

export default function RevenueChart({
  totalRevenue,
  totalExpenses,
  netProfit,
}: RevenueChartProps) {
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

      {/* Chart — min-w-0 ensures flex parent reports correct width */}
      <div className="h-64 w-full min-w-0">
        <RevenueChartInner />
      </div>

      {/* Summary row */}
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
