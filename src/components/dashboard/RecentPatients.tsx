'use client'

import { motion } from 'framer-motion'
import { Users, ChevronRight, ArrowUpRight } from 'lucide-react'
import { patients } from '@/data/patients'
import type { Patient } from '@/types'

// ✅ Matches your actual status values exactly
const statusDot: Record<string, string> = {
  active: 'bg-emerald-500',
  admitted: 'bg-amber-500',
  inactive: 'bg-white/20',
}

const statusText: Record<string, string> = {
  active: 'text-emerald-400',
  admitted: 'text-amber-400',
  inactive: 'text-white/30',
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
}

export default function RecentPatients() {
  const recent: Patient[] = patients.slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.3 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6
        hover:border-white/[0.10] transition-colors duration-300"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">
              Recent Patients
            </h2>
            <p className="text-white/40 text-xs">Latest registrations</p>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-indigo-400 text-xs
          hover:text-indigo-300 transition-colors"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Column headers ── */}
      <div className="grid grid-cols-[1fr_40px_120px_90px] gap-2 px-3 mb-2">
        {['Patient', 'Age', 'Doctor', 'Status'].map((h) => (
          <span key={h} className="text-white/30 text-xs font-medium">
            {h}
          </span>
        ))}
      </div>

      {/* ── Rows ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-1"
      >
        {recent.map((patient) => {
          const key = patient.status?.toLowerCase() ?? 'active'
          const dotColor = statusDot[key] ?? statusDot.active
          const txtColor = statusText[key] ?? statusText.active

          return (
            <motion.div
              key={patient.id}
              variants={rowVariants}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                transition: { duration: 0.15 },
              }}
              className="grid grid-cols-[1fr_40px_120px_90px] gap-2
                items-center px-3 py-2.5 rounded-xl cursor-pointer group
                border border-transparent hover:border-white/[0.04]
                transition-colors duration-150"
            >
              {/* Name + ID */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full
                  bg-gradient-to-br from-indigo-500/20 to-violet-500/20
                  border border-white/[0.08] flex items-center
                  justify-center flex-shrink-0"
                >
                  <span className="text-white/70 text-xs font-medium">
                    {getInitials(patient.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p
                    className="text-white/90 text-sm font-medium truncate
                    group-hover:text-white transition-colors"
                  >
                    {patient.name}
                  </p>
                  <p className="text-white/30 text-xs">{patient.id}</p>
                </div>
              </div>

              {/* Age */}
              <span className="text-white/50 text-sm">{patient.age}</span>

              {/* Assigned Doctor — truncated */}
              <span className="text-white/40 text-xs truncate">
                {patient.assignedDoctor} {/* ✅ real field */}
              </span>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`}
                />
                <span className={`text-xs capitalize ${txtColor}`}>
                  {patient.status}
                </span>
                <ArrowUpRight
                  className="w-3 h-3 text-white/0
                  group-hover:text-white/30 transition-colors ml-auto"
                />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
