'use client'

import { motion } from 'framer-motion'
import { Users, CalendarDays, DollarSign, UserPlus } from 'lucide-react'

const stats = [
  {
    label: 'Total Patients',
    value: '1,240',
    change: '+12%',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/10',
  },
  {
    label: 'Appointments Today',
    value: '48',
    change: '+5%',
    icon: CalendarDays,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/10',
  },
  {
    label: 'Monthly Revenue',
    value: '$24,500',
    change: '+18%',
    icon: DollarSign,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/10',
  },
  {
    label: 'New Registrations',
    value: '12',
    change: '+3%',
    icon: UserPlus,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/10',
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Welcome ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-xl font-bold text-white/80 mb-1">
          Welcome back 👋
        </h2>
        <p className="text-sm text-white/30">
          Here&apos;s what&apos;s happening with your hospital today.
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.08,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`
                bg-white/[0.02]
                border ${stat.border}
                rounded-2xl
                p-5
                hover:bg-white/[0.04]
                transition-colors duration-200
                group
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`
                  w-10 h-10 rounded-xl
                  ${stat.bg}
                  flex items-center justify-center
                  group-hover:scale-110
                  transition-transform duration-300
                `}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span
                  className="
                  text-xs font-medium
                  text-emerald-400/60
                  bg-emerald-500/10
                  px-2 py-0.5 rounded-full
                "
                >
                  {stat.change}
                </span>
              </div>

              <p className="text-2xl font-bold text-white/80 mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-white/25">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* ── Placeholder Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="
          bg-white/[0.02]
          border border-white/[0.06]
          rounded-2xl
          p-8
          flex items-center justify-center
          min-h-[300px]
        "
      >
        <div className="text-center">
          <p className="text-white/20 text-sm mb-2">
            Phase 4 will build the full dashboard here
          </p>
          <p className="text-white/10 text-xs">
            Charts, patient lists, appointment tables, and more
          </p>
        </div>
      </motion.div>
    </div>
  )
}
