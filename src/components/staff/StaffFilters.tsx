'use client'

import { motion } from 'framer-motion'
import { LayoutGrid, Table } from 'lucide-react'
import { doctors } from '@/data/doctors'

// ── Types ─────────────────────────────────────────────────────────
export type StaffRoleFilter =
  | 'All'
  | 'Doctor'
  | 'Nurse'
  | 'Pharmacist'
  | 'Receptionist'
  | 'Lab Technician'

export type StaffStatusFilter = 'All' | 'Active' | 'On Leave' | 'Inactive'
export type ViewMode = 'grid' | 'table'

interface StaffFiltersProps {
  roleFilter: StaffRoleFilter
  statusFilter: StaffStatusFilter
  onRoleChange: (r: StaffRoleFilter) => void
  onStatusChange: (s: StaffStatusFilter) => void
  viewMode: ViewMode
  onViewChange: (v: ViewMode) => void
}

// ── Role filters with counts ──────────────────────────────────────
const roles: StaffRoleFilter[] = [
  'All',
  'Doctor',
  'Nurse',
  'Pharmacist',
  'Receptionist',
  'Lab Technician',
]

const statusFilters: {
  label: StaffStatusFilter
  active: string
}[] = [
  {
    label: 'All',
    active: 'bg-white/[0.08] text-white border-white/[0.12]',
  },
  {
    label: 'Active',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    label: 'On Leave',
    active: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    label: 'Inactive',
    active: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
]

export default function StaffFilters({
  roleFilter,
  statusFilter,
  onRoleChange,
  onStatusChange,
  viewMode,
  onViewChange,
}: StaffFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
      className="space-y-3"
    >
      {/* Row 1: Status filters + View toggle */}
      <div
        className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-3"
      >
        {/* Status tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map((f) => {
            const isActive = f.label === statusFilter
            return (
              <motion.button
                key={f.label}
                onClick={() => onStatusChange(f.label)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium border
                  transition-all duration-200
                  ${
                    isActive
                      ? f.active
                      : `bg-transparent border-white/[0.06] text-white/40
                       hover:text-white/70 hover:border-white/[0.10]`
                  }`}
              >
                {f.label}
              </motion.button>
            )
          })}
        </div>

        {/* View toggle */}
        <div
          className="flex items-center gap-1 bg-white/[0.03] border
          border-white/[0.06] rounded-xl p-1"
        >
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 rounded-lg transition-all duration-200
              ${
                viewMode === 'grid'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`p-2 rounded-lg transition-all duration-200
              ${
                viewMode === 'table'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            title="Table view"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Role/department pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/30 text-xs font-medium mr-1">Role:</span>
        {roles.map((role) => {
          const isActive = role === roleFilter
          const count =
            role === 'All'
              ? doctors.length
              : doctors.filter((d) => d.role === role).length

          return (
            <motion.button
              key={role}
              onClick={() => onRoleChange(role)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 py-1 rounded-lg text-xs font-medium border
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : `bg-transparent border-white/[0.06] text-white/40
                     hover:text-white/60 hover:border-white/[0.10]`
                }`}
            >
              {role}
              <span
                className={`ml-1.5 ${isActive ? 'text-indigo-400/60' : 'text-white/20'}`}
              >
                {count}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
