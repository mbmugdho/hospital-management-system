'use client'

import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react'
import SampleBadge from '@/components/shared/SampleBadge'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Doctor } from '@/types'
import type { StaffRoleFilter, StaffStatusFilter } from './StaffFilters'

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

const avatarGradient: Record<string, string> = {
  doctor: 'from-indigo-500/30 to-violet-500/30',
  nurse: 'from-sky-500/30    to-cyan-500/30',
  pharmacist: 'from-violet-500/30 to-purple-500/30',
  receptionist: 'from-pink-500/30   to-rose-500/30',
  'lab technician': 'from-amber-500/30  to-orange-500/30',
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
    year: 'numeric',
  })
}

interface StaffGridProps {
  staff: WithMeta<Doctor>[]
  search: string
  roleFilter: StaffRoleFilter
  statusFilter: StaffStatusFilter
  onEdit: (doc: WithMeta<Doctor>) => void
  onDelete: (doc: WithMeta<Doctor>) => void
}

export default function StaffGrid({
  staff,
  search,
  roleFilter,
  statusFilter,
  onEdit,
  onDelete,
}: StaffGridProps) {
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

  if (filtered.length === 0) {
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
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {/*
        Layout animation only on filter change.
        No stagger on re-filter — only on initial mount.
      */}
      {filtered.map((doc, i) => {
        const sKey = doc.status.toLowerCase()
        const rKey = doc.role.toLowerCase()
        const badge = statusStyle[sKey] ?? statusStyle.active
        const dot = statusDot[sKey] ?? statusDot.active
        const roleBadge = roleColor[rKey] ?? 'bg-white/[0.04] text-white/40'
        const gradient = avatarGradient[rKey] ?? 'from-white/10 to-white/5'

        const today = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
        })
        const isAvailableToday = doc.availability.includes(today)

        return (
          <motion.div
            key={doc._localId}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
              delay: i * 0.05,
            }}
            whileHover={{
              y: -4,
              transition: { type: 'spring', stiffness: 400, damping: 20 },
            }}
            className="group bg-white/[0.02] border border-white/[0.06]
              rounded-2xl p-5 cursor-pointer
              hover:border-white/[0.10] hover:bg-white/[0.03]
              transition-all duration-300 relative overflow-hidden"
          >
            {/* Glow orb on hover */}
            <div
              className={`absolute -top-8 -right-8 w-28 h-28 rounded-full
                blur-3xl opacity-0 group-hover:opacity-100
                transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
            />

            {/* Top row: avatar + status */}
            <div className="flex items-start justify-between mb-4 relative">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${gradient} border border-white/[0.08]`}
                >
                  <span className="text-white/80 text-sm font-bold">
                    {getInitials(doc.name)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm group-hover:text-white transition-colors">
                      {doc.name}
                    </p>
                    {doc._isDummy && <SampleBadge />}
                  </div>
                  <p className="text-white/40 text-xs">{doc.id}</p>
                </div>
              </div>

              <span
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {doc.status}
              </span>
            </div>

            {/* Role + specialization */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg ${roleBadge}`}
              >
                {doc.role}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs truncate">
                {doc.specialization}
              </span>
            </div>

            {/* Department */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-3 h-3 text-white/25 flex-shrink-0" />
              <span className="text-white/40 text-xs">{doc.department}</span>
            </div>

            {/* Contact */}
            <div className="space-y-1.5 mb-4">
              <a
                href={`mailto:${doc.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-white/40 text-xs hover:text-indigo-400 transition-colors"
              >
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{doc.email}</span>
              </a>
              <a
                href={`tel:${doc.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-white/40 text-xs hover:text-indigo-400 transition-colors"
              >
                <Phone className="w-3 h-3 flex-shrink-0" />
                {doc.phone}
              </a>
            </div>

            {/* Footer: availability + joined */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-white/25" />
                <span
                  className={`text-xs font-medium ${isAvailableToday ? 'text-emerald-400' : 'text-white/30'}`}
                >
                  {isAvailableToday ? 'Available today' : 'Not today'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-white/25" />
                <span className="text-white/30 text-xs">
                  {formatDate(doc.joinedAt)}
                </span>
              </div>
            </div>

            {/* Edit and delete actions — appear on hover */}
            <div
              className="absolute top-4 right-4 flex items-center gap-1
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(doc)
                }}
                className="p-1.5 rounded-lg text-white/30 hover:text-indigo-400
                  hover:bg-indigo-500/10 transition-all duration-150"
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
                className="p-1.5 rounded-lg text-white/30 hover:text-red-400
                  hover:bg-red-500/10 transition-all duration-150"
                title="Delete staff member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Bottom accent line */}
            <div
              className={`absolute bottom-0 left-0 h-[2px] w-0
              group-hover:w-full transition-all duration-500 ease-out
              bg-gradient-to-r ${gradient.replace(/\/30/g, '/60')}`}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
