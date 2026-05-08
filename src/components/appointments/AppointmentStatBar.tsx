'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Clock, CheckCircle, Timer } from 'lucide-react'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Appointment } from '@/types'

interface AppointmentStatBarProps {
  appointments: WithMeta<Appointment>[]
  loading?: boolean
}

function StatSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex-shrink-0" />
      <div className="flex flex-col gap-1.5">
        <div className="h-6 w-10 bg-white/[0.06] rounded-lg" />
        <div className="h-3 w-28 bg-white/[0.04] rounded-full" />
      </div>
    </div>
  )
}

export default function AppointmentStatBar({
  appointments,
  loading = false,
}: AppointmentStatBarProps) {
  // Use state for today's date to avoid hydration mismatch
  const [todayStr, setTodayStr] = useState('')

  useEffect(() => {
    const d = new Date()
    setTodayStr(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    )
  }, [])

  const total = appointments.length
  const today = todayStr
    ? appointments.filter((a) => a.date === todayStr).length
    : 0
  const pending = appointments.filter((a) => a.status === 'Pending').length
  const completed = appointments.filter((a) => a.status === 'Completed').length

  const stats = [
    {
      label: 'Total Appointments',
      value: total,
      icon: CalendarCheck,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      label: 'Today',
      value: today,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Timer,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    )
  }

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
              hover:border-white/[0.10] transition-colors duration-300 cursor-default"
          >
            <div
              className={`p-2.5 rounded-xl ${stat.bg} border ${stat.border} flex-shrink-0`}
            >
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
