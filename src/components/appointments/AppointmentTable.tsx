'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  MoreHorizontal,
  User,
  Stethoscope,
} from 'lucide-react'
import { appointments } from '@/data/appointments'
import type { Appointment } from '@/types'
import type { AppointmentFilterStatus } from './AppointmentFilters'

// ── Types ─────────────────────────────────────────────────────────
type SortField = 'patient' | 'doctor' | 'date' | 'type' | 'status'
type SortDir = 'asc' | 'desc'

// ── Status styles ─────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pending: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  completed: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  cancelled: 'bg-red-500/10   text-red-400    border border-red-500/20',
}

const statusDot: Record<string, string> = {
  confirmed: 'bg-emerald-500',
  pending: 'bg-amber-500',
  completed: 'bg-indigo-500',
  cancelled: 'bg-red-500',
}

const typeStyle: Record<string, string> = {
  'check-up': 'bg-sky-500/10     text-sky-400',
  'follow-up': 'bg-violet-500/10  text-violet-400',
  consultation: 'bg-indigo-500/10  text-indigo-400',
  emergency: 'bg-red-500/10     text-red-400',
}

// ── Helpers ───────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ── Sort icon ─────────────────────────────────────────────────────
function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField
  sortField: SortField
  sortDir: SortDir
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 text-white/20" />
  return sortDir === 'asc' ? (
    <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
  )
}

// ── Props ─────────────────────────────────────────────────────────
interface AppointmentTableProps {
  search: string
  filter: AppointmentFilterStatus
  dateFilter: string
}

// ── Component ─────────────────────────────────────────────────────
export default function AppointmentTable({
  search,
  filter,
  dateFilter,
}: AppointmentTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // ── Filter ──────────────────────────────────────────────────────
  const filtered: Appointment[] = appointments.filter((a) => {
    const matchStatus =
      filter === 'All' || a.status.toLowerCase() === filter.toLowerCase()

    const matchDate = !dateFilter || a.date === dateFilter

    const q = search.toLowerCase()
    const matchSearch =
      a.patient.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)

    return matchStatus && matchDate && matchSearch
  })

  // ── Sort ────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    const valA = String(a[sortField] ?? '').toLowerCase()
    const valB = String(b[sortField] ?? '').toLowerCase()
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  // ── Toggle sort ─────────────────────────────────────────────────
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  // ── Column header ────────────────────────────────────────────────
  function ColHeader({
    field,
    label,
    className = '',
  }: {
    field: SortField
    label: string
    className?: string
  }) {
    return (
      <th className={`px-4 py-3 text-left ${className}`}>
        <button
          onClick={() => toggleSort(field)}
          className="flex items-center gap-1.5 text-white/40 text-xs
            font-medium hover:text-white/70 transition-colors"
        >
          {label}
          <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
        </button>
      </th>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────
  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
          p-16 text-center"
      >
        <p className="text-white/30 text-sm">No appointments found</p>
        <p className="text-white/20 text-xs mt-1">
          Try adjusting your search, filter or date
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.2 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
        overflow-hidden hover:border-white/[0.10] transition-colors duration-300"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* ── Head ── */}
          <thead>
            <tr className="border-b border-white/[0.06]">
              <ColHeader field="patient" label="Patient" className="pl-5" />
              <ColHeader field="doctor" label="Doctor" />
              <ColHeader field="type" label="Type" />
              <ColHeader field="date" label="Date" />
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium">
                Time
              </th>
              <ColHeader field="status" label="Status" />
              <th
                className="px-4 py-3 text-right text-white/40
                text-xs font-medium pr-5"
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((appt, i) => {
                const statusKey = appt.status.toLowerCase()
                const typeKey = appt.type.toLowerCase()
                const badge = statusStyle[statusKey] ?? statusStyle.pending
                const dot = statusDot[statusKey] ?? statusDot.pending
                const typeBadge =
                  typeStyle[typeKey] ?? 'bg-white/[0.04] text-white/40'
                const isHovered = hoveredId === appt.id

                return (
                  <motion.tr
                    key={appt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 28,
                      delay: i * 0.04,
                    }}
                    onHoverStart={() => setHoveredId(appt.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="border-b border-white/[0.04] last:border-0
                      transition-colors duration-150 cursor-pointer"
                    style={{
                      backgroundColor: isHovered
                        ? 'rgba(255,255,255,0.025)'
                        : 'transparent',
                    }}
                  >
                    {/* Patient */}
                    <td className="px-4 py-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0
                          bg-gradient-to-br from-indigo-500/20 to-violet-500/20
                          border border-white/[0.08]
                          flex items-center justify-center"
                        >
                          <span className="text-white/70 text-xs font-semibold">
                            {getInitials(appt.patient)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white/90 text-sm font-medium">
                            {appt.patient}
                          </p>
                          <p className="text-white/30 text-xs flex items-center gap-1">
                            <User className="w-2.5 h-2.5" />
                            {appt.patientId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-3.5">
                      <p className="text-white/70 text-sm">{appt.doctor}</p>
                      <p className="text-white/30 text-xs flex items-center gap-1">
                        <Stethoscope className="w-2.5 h-2.5" />
                        {appt.doctorId}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1
                        rounded-lg capitalize ${typeBadge}`}
                      >
                        {appt.type}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <p className="text-white/70 text-sm">
                        {formatDate(appt.date)}
                      </p>
                      <p className="text-white/30 text-xs">{appt.date}</p>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3.5">
                      <p className="text-white/60 text-sm">{appt.time}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs
                        font-medium px-2.5 py-1 rounded-full w-fit ${badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {appt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-white/30
                            hover:text-indigo-400 hover:bg-indigo-500/10
                            transition-all duration-150"
                          title="View appointment"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-white/30
                            hover:text-white/60 hover:bg-white/[0.05]
                            transition-all duration-150"
                          title="More options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-5 py-3 border-t border-white/[0.06]
        flex items-center justify-between"
      >
        <p className="text-white/30 text-xs">
          Showing{' '}
          <span className="text-white/60 font-medium">{sorted.length}</span> of{' '}
          <span className="text-white/60 font-medium">
            {appointments.length}
          </span>{' '}
          appointments
        </p>
        <p className="text-white/20 text-xs">
          Sorted by {sortField} · {sortDir === 'asc' ? '↑ A–Z' : '↓ Z–A'}
        </p>
      </div>
    </motion.div>
  )
}
