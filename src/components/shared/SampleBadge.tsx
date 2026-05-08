// Small badge displayed on dummy/sample data rows.
// Informs the user this row is demo data that resets on refresh.

'use client'

import { motion } from 'framer-motion'

interface SampleBadgeProps {
  className?: string
}

export default function SampleBadge({ className = '' }: SampleBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        inline-flex items-center px-1.5 py-0.5 rounded text-[10px]
        font-semibold tracking-wider uppercase
        bg-indigo-500/10 text-indigo-400 border border-indigo-500/20
        ${className}
      `}
    >
      Sample
    </motion.span>
  )
}
