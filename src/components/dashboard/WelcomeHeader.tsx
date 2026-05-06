'use client'

import { motion } from 'framer-motion'
import { Sparkles, Bell, Download } from 'lucide-react'

interface WelcomeHeaderProps {
  userName?: string | null
  hospitalName?: string | null
}

export default function WelcomeHeader({
  userName,
  hospitalName,
}: WelcomeHeaderProps) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const displayName = userName ?? 'Doctor'
  const displayHospital = hospitalName ?? 'MediCore Hospital'

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Left: greeting */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </motion.div>
          <span className="text-white/40 text-sm">{greeting}</span>
        </div>
        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
          {displayName}{' '}
          <span className="text-white/30 font-normal text-xl">👋</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">
          {displayHospital} &mdash;{' '}
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] 
            rounded-xl text-white/60 text-sm hover:bg-white/[0.07] hover:text-white/90 
            transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Alerts</span>
          <span
            className="w-5 h-5 bg-indigo-500 rounded-full text-white text-xs 
            flex items-center justify-center font-medium"
          >
            3
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black 
            rounded-xl text-sm font-medium hover:bg-white/90 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
