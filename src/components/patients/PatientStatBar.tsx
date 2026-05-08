'use client'

import { motion } from 'framer-motion'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Patient } from '@/types'

interface PatientStatBarProps {
  patients: WithMeta<Patient>[]
  loading?: boolean
}

// Single skeleton stat card
function StatSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 flex items-center justify-between">
      <div className="h-3 w-24 bg-white/[0.06] rounded-full" />
      <div className="h-7 w-10 bg-white/[0.06] rounded-lg" />
    </div>
  )
}

export default function PatientStatBar({
  patients,
  loading = false,
}: PatientStatBarProps) {
  const total = patients.length
  const active = patients.filter((p) => p.status === 'Active').length
  const admitted = patients.filter((p) => p.status === 'Admitted').length
  const inactive = patients.filter((p) => p.status === 'Inactive').length

  const stats = [
    { label: 'Total Patients', value: total, color: 'text-white' },
    { label: 'Active', value: active, color: 'text-emerald-400' },
    { label: 'Admitted', value: admitted, color: 'text-amber-400' },
    { label: 'Inactive', value: inactive, color: 'text-white/40' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {stats.map((stat, i) => (
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
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
            px-5 py-4 flex items-center justify-between
            hover:border-white/[0.10] transition-colors duration-300"
        >
          <span className="text-white/50 text-sm">{stat.label}</span>
          <span className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
