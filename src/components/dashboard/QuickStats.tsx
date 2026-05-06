'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Stethoscope,
  BedDouble,
  FlaskConical,
  Ambulance,
  Activity,
  ShieldCheck,
} from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────
const stats = [
  {
    label: 'Doctors on Duty',
    value: '24',
    max: 32,
    icon: Stethoscope,
    color: 'indigo',
    unit: '/ 32',
  },
  {
    label: 'Beds Occupied',
    value: '187',
    max: 240,
    icon: BedDouble,
    color: 'violet',
    unit: '/ 240',
  },
  {
    label: 'Lab Tests Today',
    value: '63',
    max: 100,
    icon: FlaskConical,
    color: 'sky',
    unit: 'today',
  },
  {
    label: 'Ambulances Active',
    value: '5',
    max: 8,
    icon: Ambulance,
    color: 'amber',
    unit: '/ 8',
  },
  {
    label: 'Critical Patients',
    value: '8',
    max: 20,
    icon: Activity,
    color: 'red',
    unit: 'in ICU',
  },
  {
    label: 'Surgeries Today',
    value: '7',
    max: 12,
    icon: ShieldCheck,
    color: 'emerald',
    unit: '/ 12',
  },
]

const colorMap: Record<string, { icon: string; bar: string; text: string }> = {
  indigo: {
    icon: 'bg-indigo-500/10  text-indigo-400',
    bar: 'bg-indigo-500',
    text: 'text-indigo-400',
  },
  violet: {
    icon: 'bg-violet-500/10  text-violet-400',
    bar: 'bg-violet-500',
    text: 'text-violet-400',
  },
  sky: {
    icon: 'bg-sky-500/10     text-sky-400',
    bar: 'bg-sky-500',
    text: 'text-sky-400',
  },
  amber: {
    icon: 'bg-amber-500/10   text-amber-400',
    bar: 'bg-amber-500',
    text: 'text-amber-400',
  },
  red: {
    icon: 'bg-red-500/10     text-red-400',
    bar: 'bg-red-500',
    text: 'text-red-400',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
  },
}

// ── Animation variants ────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
}

export default function QuickStats() {
  // ✅ Fix: null on server, real time only after client mounts
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    // Set immediately on mount
    setTime(new Date().toLocaleTimeString())

    // Live clock — updates every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.35 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6
        hover:border-white/[0.10] transition-colors duration-300"
    >
      {/* ── Header ── */}
      <div className="mb-5">
        <h2 className="text-white font-semibold text-base">Hospital Status</h2>
        <p className="text-white/40 text-xs mt-0.5">
          Live operational overview
        </p>
      </div>

      {/* ── Stat rows ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          const colors = colorMap[stat.color]
          const pct = Math.round((parseInt(stat.value) / stat.max) * 100)

          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-1.5 rounded-lg flex-shrink-0 ${colors.icon}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs font-medium truncate">
                      {stat.label}
                    </span>
                    <span className={`text-xs font-bold ml-2 ${colors.text}`}>
                      {stat.value}{' '}
                      <span className="text-white/30 font-normal">
                        {stat.unit}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden ml-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className={`h-full rounded-full opacity-80 ${colors.bar}`}
                />
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Footer — live clock ── */}
      <div className="mt-5 pt-5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse
            flex-shrink-0"
          />
          <span className="text-white/30 text-xs">
            {/* ✅ null on server = no text = no mismatch */}
            {time ? `Last updated ${time}` : 'Loading...'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
