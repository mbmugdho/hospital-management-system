'use client'

import { motion } from 'framer-motion'
import {
  Users,
  CalendarCheck,
  DollarSign,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface StatCardsProps {
  totalPatients: number
  appointmentsToday: number
  totalRevenue: number
  newRegistrations: number
}

const colorMap: Record<string, { icon: string; glow: string }> = {
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/10',
  },
  violet: {
    icon: 'bg-violet-500/10 text-violet-400',
    glow: 'group-hover:shadow-violet-500/10',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  sky: {
    icon: 'bg-sky-500/10 text-sky-400',
    glow: 'group-hover:shadow-sky-500/10',
  },
}

const glowBg: Record<string, string> = {
  indigo: 'bg-indigo-500/10',
  violet: 'bg-violet-500/10',
  emerald: 'bg-emerald-500/10',
  sky: 'bg-sky-500/10',
}

const accentBar: Record<string, string> = {
  indigo: 'bg-gradient-to-r from-indigo-500/60 to-transparent',
  violet: 'bg-gradient-to-r from-violet-500/60 to-transparent',
  emerald: 'bg-gradient-to-r from-emerald-500/60 to-transparent',
  sky: 'bg-gradient-to-r from-sky-500/60 to-transparent',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
}

export default function StatCards({
  totalPatients,
  appointmentsToday,
  totalRevenue,
  newRegistrations,
}: StatCardsProps) {
  const stats = [
    {
      label: 'Total Patients',
      value: totalPatients.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'indigo',
      description: 'vs last month',
    },
    {
      label: 'Appointments Today',
      value: appointmentsToday.toString(),
      change: '+3.2%',
      trend: 'up',
      icon: CalendarCheck,
      color: 'violet',
      description: 'vs yesterday',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+18.4%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      description: 'total billed',
    },
    {
      label: 'New Registrations',
      value: newRegistrations.toString(),
      change: '+18.7%',
      trend: 'up',
      icon: UserPlus,
      color: 'sky',
      description: 'this month',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        const colors = colorMap[stat.color]!
        const isUp = stat.trend === 'up'

        return (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={{
              y: -4,
              transition: { type: 'spring', stiffness: 400, damping: 20 },
            }}
            className={`group relative bg-white/[0.02] border border-white/[0.06]
              rounded-2xl p-6 overflow-hidden cursor-default
              transition-shadow duration-300
              hover:border-white/[0.10] hover:shadow-xl ${colors.glow}`}
          >
            {/* Glow orb on hover */}
            <div
              className={`absolute -top-6 -right-6 w-24 h-24 rounded-full
                blur-2xl opacity-0 group-hover:opacity-100
                transition-opacity duration-500 ${glowBg[stat.color]}`}
            />

            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${colors.icon}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium
                  px-2 py-1 rounded-full
                  ${
                    isUp
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-white/60">{stat.label}</p>
              <p className="text-xs text-white/30">{stat.description}</p>
            </div>

            {/* Bottom accent bar */}
            <div
              className={`absolute bottom-0 left-0 h-[2px] w-0
                group-hover:w-full transition-all duration-500 ease-out
                ${accentBar[stat.color]}`}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
