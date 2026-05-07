'use client'

import { motion } from 'framer-motion'
import { invoices } from '@/data/billing'
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function BillingStatBar() {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const paidTotal = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)
  const unpaidTotal = invoices
    .filter((inv) => inv.status === 'Unpaid')
    .reduce((sum, inv) => sum + inv.total, 0)
  const partialTotal = invoices
    .filter((inv) => inv.status === 'Partial')
    .reduce((sum, inv) => sum + inv.total, 0)

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      sub: `${invoices.length} invoices`,
    },
    {
      label: 'Paid',
      value: `$${paidTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      sub: `${invoices.filter((i) => i.status === 'Paid').length} invoices`,
    },
    {
      label: 'Unpaid',
      value: `$${unpaidTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      sub: `${invoices.filter((i) => i.status === 'Unpaid').length} invoices`,
    },
    {
      label: 'Partial',
      value: `$${partialTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: AlertTriangle,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      sub: `${invoices.filter((i) => i.status === 'Partial').length} invoices`,
    },
  ]

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
              hover:border-white/[0.10] transition-colors duration-300
              cursor-default"
          >
            <div
              className={`p-2.5 rounded-xl ${stat.bg} border ${stat.border}
                flex-shrink-0`}
            >
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
              <p className="text-white/20 text-xs">{stat.sub}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
