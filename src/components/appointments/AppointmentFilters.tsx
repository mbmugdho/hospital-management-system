'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export type AppointmentFilterStatus =
  | 'All'
  | 'Confirmed'
  | 'Pending'
  | 'Completed'
  | 'Cancelled'

interface AppointmentFiltersProps {
  active: AppointmentFilterStatus
  onChange: (f: AppointmentFilterStatus) => void
  dateFilter: string
  onDateChange: (d: string) => void
}

const filters: {
  label: AppointmentFilterStatus
  active: string
}[] = [
  {
    label: 'All',
    active: 'bg-white/[0.08] text-white border-white/[0.12]',
  },
  {
    label: 'Confirmed',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    label: 'Pending',
    active: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    label: 'Completed',
    active: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  {
    label: 'Cancelled',
    active: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
]

export default function AppointmentFilters({
  active: activeFilter,
  onChange,
  dateFilter,
  onDateChange,
}: AppointmentFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
      className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-3"
    >
      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap">
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
      </div>

      {/* Date filter */}
      <div className="relative flex-shrink-0">
        <Calendar
          className="absolute left-3 top-1/2 -translate-y-1/2
          w-4 h-4 text-white/30 pointer-events-none"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="pl-9 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.08]
            rounded-xl text-white/60 text-sm outline-none
            focus:border-indigo-500/50 focus:bg-white/[0.06]
            transition-all duration-200
            [color-scheme:dark]"
        />
      </div>
    </motion.div>
  )
}
