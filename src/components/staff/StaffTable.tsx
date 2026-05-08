'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react'
import SampleBadge from '@/components/shared/SampleBadge'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Doctor } from '@/types'
import type { StaffRoleFilter, StaffStatusFilter } from './StaffFilters'

type SortField = 'name' | 'role' | 'department' | 'status' | 'joinedAt'
type SortDir = 'asc' | 'desc'

const statusStyle: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'on leave': 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  inactive: 'bg-red-500/10    text-red-400    border border-red-500/20',
}

const statusDot: Record<string, string> = {
  active: 'bg-emerald-500',
  'on leave': 'bg-amber-500',
  inactive: 'bg-red-500',
}

const roleColor: Record<string, string> = {
  doctor: 'bg-indigo-500/10 text-indigo-400',
  nurse: 'bg-sky-500/10    text-sky-400',
  pharmacist: 'bg-violet-500/10 text-violet-400',
  receptionist: 'bg-pink-500/10   text-pink-400',
  'lab technician': 'bg-amber-500/10  text-amber-400',
}

function getInitials(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, '')
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

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

interface StaffTableProps {
  staff: WithMeta<Doctor>[]
  search: string
  roleFilter: StaffRoleFilter
  statusFilter: StaffStatusFilter
  onEdit: (doc: WithMeta<Doctor>) => void
  onDelete: (doc: WithMeta<Doctor>) => void
}

export default function StaffTable({
  staff,
  search,
  roleFilter,
  statusFilter,
  onEdit,
  onDelete,
}: StaffTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filtered = staff.filter((d) => {
    const matchRole = roleFilter === 'All' || d.role === roleFilter
    const matchStatus =
      statusFilter === 'All' ||
      d.status.toLowerCase() === statusFilter.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch =
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    return matchRole && matchStatus && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    const valA = String(a[sortField] ?? '').toLowerCase()
    const valB = String(b[sortField] ?? '').toLowerCase()
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

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

  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center"
      >
        <p className="text-white/30 text-sm">No staff members found</p>
        <p className="text-white/20 text-xs mt-1">
          Try adjusting your search or filters
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
          <thead>
            <tr className="border-b border-white/[0.06]">
              <ColHeader field="name" label="Name" className="pl-5" />
              <ColHeader field="role" label="Role" />
              <ColHeader field="department" label="Department" />
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium hidden lg:table-cell">
                Availability
              </th>
              <ColHeader
                field="joinedAt"
                label="Joined"
                className="hidden md:table-cell"
              />
              <ColHeader field="status" label="Status" />
              <th className="px-4 py-3 text-right text-white/40 text-xs font-medium pr-5">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((doc) => {
              const sKey = doc.status.toLowerCase()
              const rKey = doc.role.toLowerCase()
              const badge = statusStyle[sKey] ?? statusStyle.active
              const dot = statusDot[sKey] ?? statusDot.active
              const roleBg = roleColor[rKey] ?? 'bg-white/[0.04] text-white/40'

              return (
                <motion.tr
                  key={doc._localId}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="border-b border-white/[0.04] last:border-0
                    hover:bg-white/[0.025] transition-colors duration-150 cursor-pointer"
                >
                  {/* Name */}
                  <td className="px-4 py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex-shrink-0
                        bg-gradient-to-br from-indigo-500/20 to-violet-500/20
                        border border-white/[0.08] flex items-center justify-center"
                      >
                        <span className="text-white/70 text-xs font-semibold">
                          {getInitials(doc.name)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white/90 text-sm font-medium">
                            {doc.name}
                          </p>
                          {doc._isDummy && <SampleBadge />}
                        </div>
                        <p className="text-white/30 text-xs">
                          {doc.specialization}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${roleBg}`}
                    >
                      {doc.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3.5">
                    <p className="text-white/60 text-sm">{doc.department}</p>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`mailto:${doc.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-white/40 text-xs hover:text-indigo-400 transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">
                          {doc.email}
                        </span>
                      </a>
                      <a
                        href={`tel:${doc.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-white/40 text-xs hover:text-indigo-400 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        {doc.phone}
                      </a>
                    </div>
                  </td>

                  {/* Availability dots */}
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                      ].map((fullDay, idx) => {
                        const isOn = doc.availability.includes(fullDay)
                        const label = ['M', 'T', 'W', 'T', 'F', 'S'][idx]
                        return (
                          <span
                            key={`${doc._localId}-${idx}`}
                            title={fullDay}
                            className={`w-5 h-5 rounded text-xs flex items-center
                              justify-center font-medium
                              ${
                                isOn
                                  ? 'bg-indigo-500/15 text-indigo-400'
                                  : 'bg-white/[0.03] text-white/15'
                              }`}
                          >
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-white/50 text-xs">
                      {formatDate(doc.joinedAt)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`flex items-center gap-1.5 text-xs
                      font-medium px-2.5 py-1 rounded-full w-fit ${badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {doc.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(doc)
                        }}
                        className="p-1.5 rounded-lg text-white/30
                          hover:text-indigo-400 hover:bg-indigo-500/10
                          transition-all duration-150"
                        title="Edit staff member"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(doc)
                        }}
                        className="p-1.5 rounded-lg text-white/30
                          hover:text-red-400 hover:bg-red-500/10
                          transition-all duration-150"
                        title="Delete staff member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <p className="text-white/30 text-xs">
          Showing{' '}
          <span className="text-white/60 font-medium">{sorted.length}</span> of{' '}
          <span className="text-white/60 font-medium">{staff.length}</span>{' '}
          staff
        </p>
        <p className="text-white/20 text-xs">
          Sorted by {sortField} · {sortDir === 'asc' ? 'A–Z' : 'Z–A'}
        </p>
      </div>
    </motion.div>
  )
}
