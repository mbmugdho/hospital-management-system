// Reusable skeleton loader for all table pages.
// Renders placeholder rows while data is being fetched from Supabase.

'use client'

import { motion } from 'framer-motion'

interface TableSkeletonProps {
  rows?: number
  cols?: number
}

// Single shimmer cell
function SkeletonCell({ width = 'w-full' }: { width?: string }) {
  return (
    <div
      className={`h-3.5 ${width} bg-white/[0.06] rounded-full overflow-hidden relative`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// Column width patterns — rotates to look natural
const widthPatterns = [
  ['w-32', 'w-20'],
  ['w-8', 'w-12'],
  ['w-10'],
  ['w-24', 'w-20'],
  ['w-28'],
  ['w-16'],
  ['w-14'],
  ['w-8'],
]

export default function TableSkeleton({
  rows = 8,
  cols = 8,
}: TableSkeletonProps) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* Table header skeleton */}
      <div className="border-b border-white/[0.06] px-5 py-3 flex items-center gap-8">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1">
            <SkeletonCell width="w-16" />
          </div>
        ))}
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <motion.div
          key={rowIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: rowIdx * 0.04, duration: 0.3 }}
          className="px-5 py-4 border-b border-white/[0.04] last:border-0 flex items-center gap-8"
        >
          {/* Avatar + name skeleton */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-full bg-white/[0.05] flex-shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <SkeletonCell width="w-28" />
              <SkeletonCell width="w-16" />
            </div>
          </div>

          {/* Remaining cells */}
          {Array.from({ length: cols - 1 }).map((_, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-1.5">
              {(widthPatterns[colIdx + 1] ?? ['w-20']).map((w, wi) => (
                <SkeletonCell key={wi} width={w} />
              ))}
            </div>
          ))}
        </motion.div>
      ))}

      {/* Footer skeleton */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <SkeletonCell width="w-40" />
        <SkeletonCell width="w-24" />
      </div>
    </div>
  )
}
