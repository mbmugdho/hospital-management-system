'use client'

import { motion } from 'framer-motion'
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Invoice } from '@/types'

interface BillingStatBarProps {
  invoices: WithMeta<Invoice>[]
  loading?: boolean
}

function StatSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex-shrink-0" />
      <div className="flex flex-col gap-1.5">
        <div className="h-5 w-24 bg-white/[0.06] rounded-lg" />
        <div className="h-3 w-16 bg-white/[0.04] rounded-full" />
        <div className="h-3 w-20 bg-white/[0.03] rounded-full" />
      </div>
    </div>
  )
}

function fmt(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default function BillingStatBar({
  invoices,
  loading = false,
}: BillingStatBarProps) {
  const totalRevenue = invoices.reduce((s, inv) => s + inv.total, 0)
  const paidTotal = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((s, i) => s + i.total, 0)
  const unpaidTotal = invoices
    .filter((i) => i.status === 'Unpaid')
    .reduce((s, i) => s + i.total, 0)
  const partialTotal = invoices
    .filter((i) => i.status === 'Partial')
    .reduce((s, i) => s + i.total, 0)

  const paidCount = invoices.filter((i) => i.status === 'Paid').length
  const unpaidCount = invoices.filter((i) => i.status === 'Unpaid').length
  const partialCount = invoices.filter((i) => i.status === 'Partial').length

  const stats = [
    {
      label: 'Total Revenue',
      value: fmt(totalRevenue),
      icon: DollarSign,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      sub: `${invoices.length} invoices`,
    },
    {
      label: 'Paid',
      value: fmt(paidTotal),
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      sub: `${paidCount} invoices`,
    },
    {
      label: 'Unpaid',
      value: fmt(unpaidTotal),
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      sub: `${unpaidCount} invoices`,
    },
    {
      label: 'Partial',
      value: fmt(partialTotal),
      icon: AlertTriangle,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      sub: `${partialCount} invoices`,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
              delay: 0.1 + i * 0.07,
            }}
            whileHover={{
              y: -3,
              transition: { type: 'spring', stiffness: 400, damping: 20 },
            }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
              px-5 py-4 flex items-center gap-4
              hover:border-white/[0.10] transition-colors duration-300 cursor-default"
          >
            <div
              className={`p-2.5 rounded-xl ${stat.bg} border ${stat.border} flex-shrink-0`}
            >
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-sm md:text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
              <p className="text-white/20 text-xs">{stat.sub}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
