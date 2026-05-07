'use client'

import { motion } from 'framer-motion'
import { medicines } from '@/data/pharmacy'

// ── Types ─────────────────────────────────────────────────────────
export type StockFilter = 'All' | 'High' | 'Medium' | 'Low'
export type CategoryFilter = string

interface PharmacyFiltersProps {
  stockFilter: StockFilter
  categoryFilter: CategoryFilter
  onStockChange: (s: StockFilter) => void
  onCategoryChange: (c: CategoryFilter) => void
}

// ── Stock filter tabs ─────────────────────────────────────────────
const stockFilters: {
  label: StockFilter
  active: string
}[] = [
  {
    label: 'All',
    active: 'bg-white/[0.08] text-white border-white/[0.12]',
  },
  {
    label: 'High',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    label: 'Medium',
    active: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    label: 'Low',
    active: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
]

// ── Get unique categories from data ───────────────────────────────
const categories = [
  'All',
  ...Array.from(new Set(medicines.map((m) => m.category))).sort(),
]

export default function PharmacyFilters({
  stockFilter,
  categoryFilter,
  onStockChange,
  onCategoryChange,
}: PharmacyFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
      className="space-y-3"
    >
      {/* Row 1: Stock level filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/30 text-xs font-medium mr-1">Stock:</span>
        {stockFilters.map((f) => {
          const isActive = f.label === stockFilter
          return (
            <motion.button
              key={f.label}
              onClick={() => onStockChange(f.label)}
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

      {/* Row 2: Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/30 text-xs font-medium mr-1">
          Category:
        </span>
        {categories.map((cat) => {
          const isActive = cat === categoryFilter
          const count =
            cat === 'All'
              ? medicines.length
              : medicines.filter((m) => m.category === cat).length

          return (
            <motion.button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 py-1 rounded-lg text-xs font-medium border
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : `bg-transparent border-white/[0.06] text-white/40
                     hover:text-white/60 hover:border-white/[0.10]`
                }`}
            >
              {cat}
              <span
                className={`ml-1.5 ${isActive ? 'text-indigo-400/60' : 'text-white/20'}`}
              >
                {count}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
