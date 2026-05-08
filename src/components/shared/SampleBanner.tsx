'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

interface SampleBannerProps {
  sampleCount: number
  hideSample: boolean
  onToggle: () => void
  onClear: () => void
}

export default function SampleBanner({
  sampleCount,
  hideSample,
  onToggle,
  onClear,
}: SampleBannerProps) {
  return (
    <AnimatePresence>
      {!hideSample && sampleCount > 0 && (
        <motion.div
          key="sample-visible"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="overflow-hidden"
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center
            sm:justify-between gap-3
            px-4 py-3 bg-indigo-500/[0.06]
            border border-indigo-500/[0.15] rounded-xl"
          >
            {/* Text */}
            <p className="text-indigo-300/80 text-sm leading-snug">
              <span className="font-semibold text-indigo-300">
                {sampleCount} sample record{sampleCount !== 1 ? 's' : ''}
              </span>{' '}
              are visible. These reset on page refresh.
            </p>

            {/* Buttons — wrap on very small screens */}
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <button
                onClick={onClear}
                className="text-xs text-indigo-400 hover:text-indigo-300
                  px-3 py-1.5 rounded-lg border border-indigo-500/20
                  hover:border-indigo-500/40 transition-all duration-150
                  whitespace-nowrap"
              >
                Clear Sample Data
              </button>
              <button
                onClick={onToggle}
                className="text-xs text-white/40 hover:text-white/60
                  px-3 py-1.5 rounded-lg border border-white/[0.08]
                  hover:border-white/[0.14] transition-all duration-150
                  flex items-center gap-1.5 whitespace-nowrap"
              >
                <EyeOff className="w-3 h-3" />
                Hide
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {hideSample && (
        <motion.div
          key="sample-hidden"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="overflow-hidden"
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center
            sm:justify-between gap-3
            px-4 py-3 bg-white/[0.02]
            border border-white/[0.06] rounded-xl"
          >
            <p className="text-white/40 text-sm">
              Sample data is hidden. Refresh the page to restore it.
            </p>
            <button
              onClick={onToggle}
              className="text-xs text-indigo-400 hover:text-indigo-300
                px-3 py-1.5 rounded-lg border border-indigo-500/20
                hover:border-indigo-500/40 transition-all duration-150
                flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <Eye className="w-3 h-3" />
              Show Sample Data
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
