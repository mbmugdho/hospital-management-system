// Shared page header used across all dashboard pages.
// Supports title, subtitle, search input, primary action, and export button slots.

'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  searchValue: string
  onSearch: (v: string) => void
  action?: ReactNode
  exportButton?: ReactNode
  searchPlaceholder?: string
}

export default function PageHeader({
  title,
  subtitle,
  searchValue,
  onSearch,
  action,
  exportButton,
  searchPlaceholder = 'Search...',
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Left */}
      <div>
        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-white/40 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/[0.04]
              border border-white/[0.08] rounded-xl text-white/80 text-sm
              placeholder:text-white/25 outline-none
              focus:border-indigo-500/50 focus:bg-white/[0.06]
              transition-all duration-200"
          />
        </div>

        {/* Export button slot */}
        {exportButton}

        {/* Primary action slot */}
        {action}
      </div>
    </motion.div>
  )
}
