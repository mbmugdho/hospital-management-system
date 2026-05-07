'use client'

import { motion } from 'framer-motion'

export type BillingFilterStatus = 'All' | 'Paid' | 'Unpaid' | 'Partial'

interface BillingFiltersProps {
  active: BillingFilterStatus
  onChange: (f: BillingFilterStatus) => void
}

const filters: {
  label: BillingFilterStatus
  active: string
}[] = [
  {
    label: 'All',
    active: 'bg-white/[0.08] text-white border-white/[0.12]',
  },
  {
    label: 'Paid',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    label: 'Unpaid',
    active: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    label: 'Partial',
    active: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
]

export default function BillingFilters({
  active: activeFilter,
  onChange,
}: BillingFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
      className="flex items-center gap-2 flex-wrap"
    >
      {filters.map((f) => {
        const isActive = f.label === activeFilter
        return (
          <motion.button
            key={f.label}
            onClick={() => onChange(f.label)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium border
              transition-all duration-200
              ${
                isActive
                  ? f.active
                  : `bg-transparent border-white/[0.06] text-white/40
                   hover:text-white/70 hover:border-white/[0.10]`
              }`}
          >
            {f.label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
