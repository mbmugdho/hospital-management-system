'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { appointments } from '@/data/appointments'
import type { Appointment } from '@/types'

// ── Status badge styles ───────────────────────────────────────────
const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  cancelled: 'bg-red-500/10   text-red-400    border border-red-500/20',
  completed: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
}

// ── Safe initials helper ──────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// ── Animation variants ────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
}

export default function TodayAppointments() {
  const todayList: Appointment[] = appointments.slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.25 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6
        hover:border-white/[0.10] transition-colors duration-300"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">
              Today&apos;s Appointments
            </h2>
            <p className="text-white/40 text-xs">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-indigo-400 text-xs
          hover:text-indigo-300 transition-colors"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── List ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {todayList.map((appt) => {
          const statusKey = appt.status.toLowerCase()
          const badgeStyle = statusStyles[statusKey] ?? statusStyles.pending
          const initials = getInitials(appt.patient) // ✅ correct field

          return (
            <motion.div
              key={appt.id}
              variants={rowVariants}
              whileHover={{
                x: 4,
                transition: { type: 'spring', stiffness: 400, damping: 20 },
              }}
              className="flex items-center gap-3 p-3 rounded-xl
                bg-white/[0.02] border border-transparent
                hover:border-white/[0.06] hover:bg-white/[0.04]
                transition-all duration-200 cursor-pointer group"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full bg-indigo-500/10
                border border-indigo-500/20 flex items-center
                justify-center flex-shrink-0"
              >
                <span className="text-indigo-400 text-xs font-semibold">
                  {initials}
                </span>
              </div>

              {/* Patient + type */}
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-medium truncate">
                  {appt.patient} {/* ✅ correct field */}
                </p>
                <p className="text-white/40 text-xs truncate">
                  {appt.type} · {appt.doctor}
                </p>
              </div>

              {/* Time */}
              <div
                className="flex items-center gap-1 text-white/40
                text-xs flex-shrink-0"
              >
                <Clock className="w-3 h-3" />
                {appt.time}
              </div>

              {/* Status badge */}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium
                flex-shrink-0 capitalize ${badgeStyle}`}
              >
                {appt.status}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
