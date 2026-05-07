'use client'

import { motion } from 'framer-motion'
import { appointments } from '@/data/appointments'
import { CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AppointmentStatBar() {
  const total = appointments.length
  const today = appointments.filter((a) => a.date === '2025-07-14').length
  const pending = appointments.filter(
    (a) => a.status.toLowerCase() === 'pending'
  ).length
  const completed = appointments.filter(
    (a) => a.status.toLowerCase() === 'completed'
  ).length
  const cancelled = appointments.filter(
    (a) => a.status.toLowerCase() === 'cancelled'
  ).length

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
      icon: Clock,
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
