'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
  FileText,
  ChevronRight,
  Download,
} from 'lucide-react'
import SampleBadge from '@/components/shared/SampleBadge'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Invoice } from '@/types'
import type { BillingFilterStatus } from './BillingFilters'

type SortField = 'id' | 'patient' | 'date' | 'total' | 'status'
type SortDir = 'asc' | 'desc'

const statusStyle: Record<string, string> = {
  paid: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  unpaid: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  partial: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
}

const statusDot: Record<string, string> = {
  paid: 'bg-emerald-500',
  unpaid: 'bg-amber-500',
  partial: 'bg-violet-500',
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

function fmt(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
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

interface BillingTableProps {
  invoices: WithMeta<Invoice>[]
  search: string
  filter: BillingFilterStatus
  onEdit: (inv: WithMeta<Invoice>) => void
  onDelete: (inv: WithMeta<Invoice>) => void
  onExportInvoice: (inv: WithMeta<Invoice>) => void
}

export default function BillingTable({
  invoices,
  search,
  filter,
  onEdit,
  onDelete,
  onExportInvoice,
}: BillingTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter by status and search query
  const filtered = invoices.filter((inv) => {
    const matchFilter =
      filter === 'All' || inv.status.toLowerCase() === filter.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch =
      inv.patient.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q) ||
      inv.patientId.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  // Sort filtered results
  const sorted = [...filtered].sort((a, b) => {
    let valA: string | number
    let valB: string | number
    if (sortField === 'total') {
      valA = a.total
      valB = b.total
    } else {
      valA = String(a[sortField] ?? '').toLowerCase()
      valB = String(b[sortField] ?? '').toLowerCase()
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

  function toggleExpand(localId: string) {
    setExpandedId((prev) => (prev === localId ? null : localId))
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
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
          p-16 text-center"
      >
        <p className="text-white/30 text-sm">No invoices found</p>
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
              <th className="w-10 px-2 py-3" />
              <ColHeader field="id" label="Invoice" className="pl-1" />
              <ColHeader field="patient" label="Patient" />
              <ColHeader field="date" label="Date" />
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium hidden md:table-cell">
                Items
              </th>
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium hidden lg:table-cell">
                Subtotal
              </th>
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium hidden lg:table-cell">
                Tax
              </th>
              <ColHeader field="total" label="Total" />
              <ColHeader field="status" label="Status" />
              <th className="px-4 py-3 text-right text-white/40 text-xs font-medium pr-5">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {sorted.map((inv) => {
              const sKey = inv.status.toLowerCase()
              const badge = statusStyle[sKey] ?? statusStyle.unpaid
              const dot = statusDot[sKey] ?? statusDot.unpaid
              const isExpanded = expandedId === inv._localId

              return (
                /*
                  React.Fragment with key is required here because we render
                  two sibling <tr> elements per invoice row inside a .map().
                  Bare <> fragments do not support the key prop.
                */
                <React.Fragment key={inv._localId}>
                  {/* Main invoice row */}
                  <motion.tr
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="border-b border-white/[0.04] last:border-0
                      hover:bg-white/[0.025] transition-colors duration-150
                      cursor-pointer"
                  >
                    {/* Expand chevron */}
                    <td className="px-2 py-3.5">
                      <motion.button
                        onClick={() => toggleExpand(inv._localId)}
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="p-1 rounded text-white/20
                          hover:text-white/50 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </td>

                    {/* Invoice ID + SAMPLE badge */}
                    <td className="px-4 py-3.5 pl-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white/90 text-sm font-medium">
                              {inv.id}
                            </p>
                            {inv._isDummy && <SampleBadge />}
                          </div>
                          <p className="text-white/30 text-xs">
                            {inv.patientId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patient avatar + name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0
                            bg-gradient-to-br from-indigo-500/20 to-violet-500/20
                            border border-white/[0.08] flex items-center justify-center"
                        >
                          <span className="text-white/70 text-xs font-semibold">
                            {getInitials(inv.patient)}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">{inv.patient}</p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <p className="text-white/60 text-sm">
                        {formatDate(inv.date)}
                      </p>
                    </td>

                    {/* Items count */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span
                        className="text-white/40 text-xs bg-white/[0.04]
                        px-2 py-0.5 rounded-md"
                      >
                        {inv.items.length} item
                        {inv.items.length !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Subtotal */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-white/40 text-sm">
                        {fmt(inv.subtotal)}
                      </p>
                    </td>

                    {/* Tax */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-white/30 text-sm">{fmt(inv.tax)}</p>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3.5">
                      <p className="text-white font-semibold text-sm">
                        {fmt(inv.total)}
                      </p>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs
                          font-medium px-2.5 py-1 rounded-full w-fit ${badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {inv.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3.5 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onExportInvoice(inv)
                          }}
                          className="p-1.5 rounded-lg text-white/30
                            hover:text-emerald-400 hover:bg-emerald-500/10
                            transition-all duration-150"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(inv)
                          }}
                          className="p-1.5 rounded-lg text-white/30
                            hover:text-indigo-400 hover:bg-indigo-500/10
                            transition-all duration-150"
                          title="Edit invoice"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(inv)
                          }}
                          className="p-1.5 rounded-lg text-white/30
                            hover:text-red-400 hover:bg-red-500/10
                            transition-all duration-150"
                          title="Delete invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>

                  {/* Expandable detail row — inline below the invoice row */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr key={`${inv._localId}-detail`}>
                        <td colSpan={10} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 30,
                            }}
                            className="overflow-hidden border-b border-white/[0.04]"
                          >
                            <div className="px-6 py-4 bg-white/[0.01]">
                              <p className="text-white/40 text-xs font-medium mb-3">
                                Line Items — {inv.id}
                              </p>

                              {/* Column headers for items */}
                              <div className="grid grid-cols-[1fr_60px_80px_80px] gap-4 px-3 mb-1">
                                {['Description', 'Qty', 'Price', 'Total'].map(
                                  (h) => (
                                    <span
                                      key={h}
                                      className="text-white/25 text-xs font-medium"
                                    >
                                      {h}
                                    </span>
                                  )
                                )}
                              </div>

                              {/* Line item rows */}
                              <div className="space-y-1">
                                {inv.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="grid grid-cols-[1fr_60px_80px_80px] gap-4
                                      px-3 py-2 rounded-lg bg-white/[0.02]"
                                  >
                                    <span className="text-white/70 text-xs">
                                      {item.description}
                                    </span>
                                    <span className="text-white/50 text-xs text-center">
                                      {item.quantity}
                                    </span>
                                    <span className="text-white/50 text-xs">
                                      {fmt(item.price)}
                                    </span>
                                    <span className="text-white/70 text-xs font-medium">
                                      {fmt(item.quantity * item.price)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Totals summary */}
                              <div
                                className="border-t border-white/[0.06] mt-3 pt-2
                                  space-y-1 max-w-xs ml-auto"
                              >
                                <div className="flex items-center justify-between px-3">
                                  <span className="text-white/40 text-xs">
                                    Subtotal
                                  </span>
                                  <span className="text-white/60 text-xs font-medium">
                                    {fmt(inv.subtotal)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between px-3">
                                  <span className="text-white/40 text-xs">
                                    Tax
                                  </span>
                                  <span className="text-white/60 text-xs font-medium">
                                    {fmt(inv.tax)}
                                  </span>
                                </div>
                                <div
                                  className="flex items-center justify-between px-3
                                    pt-1 border-t border-white/[0.06]"
                                >
                                  <span className="text-white/60 text-xs font-semibold">
                                    Total
                                  </span>
                                  <span className="text-white text-xs font-bold">
                                    {fmt(inv.total)}
                                  </span>
                                </div>
                              </div>

                              {/* Optional notes */}
                              {inv.notes && (
                                <p className="mt-3 px-3 text-white/25 text-xs">
                                  Note:{' '}
                                  <span className="text-white/40">
                                    {inv.notes}
                                  </span>
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t border-white/[0.06]
          flex items-center justify-between"
      >
        <p className="text-white/30 text-xs">
          Showing{' '}
          <span className="text-white/60 font-medium">{sorted.length}</span> of{' '}
          <span className="text-white/60 font-medium">{invoices.length}</span>{' '}
          invoices
        </p>
        <p className="text-white/20 text-xs">
          Total:{' '}
          <span className="text-white/60 font-medium">
            {fmt(sorted.reduce((s, inv) => s + inv.total, 0))}
          </span>
        </p>
      </div>
    </motion.div>
  )
}
