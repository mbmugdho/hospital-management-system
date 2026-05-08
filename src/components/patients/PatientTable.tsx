'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
  Phone,
  Mail,
} from 'lucide-react'
import SampleBadge from '@/components/shared/SampleBadge'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Patient } from '@/types'
import type { FilterStatus } from './PatientFilters'

// Sort types
type SortField = 'name' | 'age' | 'registeredAt' | 'status'
type SortDir = 'asc' | 'desc'

// Status badge styles
const statusStyle: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  admitted: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  inactive: 'bg-white/[0.04]  text-white/30   border border-white/[0.08]',
}

const statusDot: Record<string, string> = {
  active: 'bg-emerald-500',
  admitted: 'bg-amber-500',
  inactive: 'bg-white/20',
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Sort icon component
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

interface PatientTableProps {
  patients: WithMeta<Patient>[]
  search: string
  filter: FilterStatus
  onEdit: (patient: WithMeta<Patient>) => void
  onDelete: (patient: WithMeta<Patient>) => void
}

export default function PatientTable({
  patients,
  search,
  filter,
  onEdit,
  onDelete,
}: PatientTableProps) {
  const [sortField, setSortField] = useState<SortField>('registeredAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Filter by status and search query
  const filtered = patients.filter((p) => {
    const matchFilter =
      filter === 'All' || p.status.toLowerCase() === filter.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.assignedDoctor.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  // Sort filtered results
  const sorted = [...filtered].sort((a, b) => {
    let valA: string | number = a[sortField] ?? ''
    let valB: string | number = b[sortField] ?? ''
    if (sortField === 'age') {
      valA = Number(valA)
      valB = Number(valB)
    } else {
      valA = String(valA).toLowerCase()
      valB = String(valB).toLowerCase()
    }
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

  // Sortable column header
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

  // Empty state
  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center"
      >
        <p className="text-white/30 text-sm">No patients found</p>
        <p className="text-white/20 text-xs mt-1">
          Try adjusting your search or filter
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
          {/* Head */}
          <thead>
            <tr className="border-b border-white/[0.06]">
              <ColHeader field="name" label="Patient" className="pl-5" />
              <ColHeader field="age" label="Age" />
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium">
                Blood
              </th>
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium hidden lg:table-cell">
                Doctor
              </th>
              <ColHeader
                field="registeredAt"
                label="Registered"
                className="hidden md:table-cell"
              />
              <ColHeader field="status" label="Status" />
              <th className="px-4 py-3 text-white/40 text-xs font-medium text-right pr-5">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {/*
              KEY FIX: We do NOT use AnimatePresence with entry animations here.
              Instead we use layout animation only.
              This prevents the "full reload flash" when filters change.
              Rows smoothly reorder without re-playing entry animations.
            */}
            {sorted.map((patient) => {
              const key = patient.status.toLowerCase()
              const badge = statusStyle[key] ?? statusStyle.active
              const dot = statusDot[key] ?? statusDot.active

              return (
                <motion.tr
                  key={patient._localId}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="border-b border-white/[0.04] last:border-0
                    hover:bg-white/[0.025] transition-colors duration-150 cursor-pointer"
                >
                  {/* Patient name + ID + Sample badge */}
                  <td className="px-4 py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex-shrink-0
                        bg-gradient-to-br from-indigo-500/20 to-violet-500/20
                        border border-white/[0.08] flex items-center justify-center"
                      >
                        <span className="text-white/70 text-xs font-semibold">
                          {getInitials(patient.name)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white/90 text-sm font-medium">
                            {patient.name}
                          </p>
                          {patient._isDummy && <SampleBadge />}
                        </div>
                        <p className="text-white/30 text-xs">{patient.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Age + Gender */}
                  <td className="px-4 py-3.5">
                    <p className="text-white/70 text-sm">{patient.age}</p>
                    <p className="text-white/30 text-xs">{patient.gender}</p>
                  </td>

                  {/* Blood group */}
                  <td className="px-4 py-3.5">
                    <span
                      className="text-xs font-semibold px-2 py-1
                      bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg"
                    >
                      {patient.bloodGroup}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`tel:${patient.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-white/50
                          text-xs hover:text-indigo-400 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </a>
                      <a
                        href={`mailto:${patient.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-white/50
                          text-xs hover:text-indigo-400 transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">
                          {patient.email}
                        </span>
                      </a>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="text-white/60 text-xs">
                      {patient.assignedDoctor}
                    </p>
                  </td>

                  {/* Registered */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-white/50 text-xs">
                      {formatDate(patient.registeredAt)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`flex items-center gap-1.5 text-xs
                      font-medium px-2.5 py-1 rounded-full w-fit ${badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {patient.status}
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
                          onEdit(patient)
                        }}
                        className="p-1.5 rounded-lg text-white/30
                          hover:text-indigo-400 hover:bg-indigo-500/10
                          transition-all duration-150"
                        title="Edit patient"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(patient)
                        }}
                        className="p-1.5 rounded-lg text-white/30
                          hover:text-red-400 hover:bg-red-500/10
                          transition-all duration-150"
                        title="Delete patient"
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
          <span className="text-white/60 font-medium">{patients.length}</span>{' '}
          patients
        </p>
        <p className="text-white/20 text-xs">
          Sorted by {sortField} · {sortDir === 'asc' ? 'A–Z' : 'Z–A'}
        </p>
      </div>
    </motion.div>
  )
}
