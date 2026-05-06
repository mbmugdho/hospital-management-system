'use client'

import { motion } from 'framer-motion'
import { patients } from '@/data/patients'

export default function PatientStatBar() {
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
