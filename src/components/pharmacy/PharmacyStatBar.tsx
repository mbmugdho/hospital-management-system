'use client'

import { motion } from 'framer-motion'
import { medicines } from '@/data/pharmacy'
import { Pill, Package, AlertTriangle, TrendingDown } from 'lucide-react'

export default function PharmacyStatBar() {
  const total = medicines.length
  const totalStock = medicines.reduce((sum, m) => sum + m.stock, 0)
  const lowStock = medicines.filter((m) => m.stockStatus === 'Low').length
  const totalValue = medicines.reduce((sum, m) => sum + m.stock * m.price, 0)

  const stats = [
    {
      label: 'Total Medicines',
      value: total.toString(),
      icon: Pill,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      sub: `${totalStock.toLocaleString()} units in stock`,
    },
    {
      label: 'Inventory Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: Package,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      sub: 'Total stock value',
    },
    {
      label: 'Low Stock',
      value: lowStock.toString(),
      icon: TrendingDown,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      sub: 'Items need reorder',
    },
    {
      label: 'Categories',
      value: new Set(medicines.map((m) => m.category)).size.toString(),
      icon: AlertTriangle,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      sub: 'Unique categories',
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
