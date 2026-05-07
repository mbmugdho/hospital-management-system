'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Download,
  MoreHorizontal,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { invoices } from '@/data/billing'
import type { Invoice } from '@/types'
import type { BillingFilterStatus } from './BillingFilters'

// ── Types ─────────────────────────────────────────────────────────
type SortField = 'id' | 'patient' | 'date' | 'total' | 'status'
type SortDir = 'asc' | 'desc'

// ── Styles ────────────────────────────────────────────────────────
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

// ── Shared Helpers ────────────────────────────────────────────────
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

function formatCurrency(amount: number): string {
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

// ── Props ─────────────────────────────────────────────────────────
interface BillingTableProps {
  search: string
  filter: BillingFilterStatus
}

// ── Main Table Component ──────────────────────────────────────────
export default function BillingTable({ search, filter }: BillingTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // ── Filter ──────────────────────────────────────────────────────
  const filtered: Invoice[] = invoices.filter((inv) => {
    const matchFilter =
      filter === 'All' || inv.status.toLowerCase() === filter.toLowerCase()

    const q = search.toLowerCase()
    const matchSearch =
      inv.patient.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q) ||
      inv.patientId.toLowerCase().includes(q)

    return matchFilter && matchSearch
  })

  // ── Sort ────────────────────────────────────────────────────────
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

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
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

  // ── Empty state ──────────────────────────────────────────────────
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
          {/* ── Head ── */}
          <thead>
            <tr className="border-b border-white/[0.06]">
              {/* Expand toggle column */}
              <th className="w-10 px-2 py-3" />
              <ColHeader field="id" label="Invoice" className="pl-1" />
              <ColHeader field="patient" label="Patient" />
              <ColHeader field="date" label="Date" />
              <th
                className="px-4 py-3 text-left text-white/40 text-xs
                font-medium hidden md:table-cell"
              >
                Items
              </th>
              <th
                className="px-4 py-3 text-left text-white/40 text-xs
                font-medium hidden lg:table-cell"
              >
                Subtotal
              </th>
              <th
                className="px-4 py-3 text-left text-white/40 text-xs
                font-medium hidden lg:table-cell"
              >
                Tax
              </th>
              <ColHeader field="total" label="Total" />
              <ColHeader field="status" label="Status" />
              <th
                className="px-4 py-3 text-right text-white/40 text-xs
                font-medium pr-5"
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((inv, i) => {
                const sKey = inv.status.toLowerCase()
                const badge = statusStyle[sKey] ?? statusStyle.unpaid
                const dot = statusDot[sKey] ?? statusDot.unpaid
                const isHovered = hoveredId === inv.id
                const isExpanded = expandedId === inv.id

                return (
                  <tr
                    key={inv.id}
                    onMouseEnter={() => setHoveredId(inv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="border-b border-white/[0.04] last:border-0
                      cursor-pointer transition-colors duration-150"
                    style={{
                      backgroundColor: isHovered
                        ? 'rgba(255,255,255,0.025)'
                        : 'transparent',
                    }}
                  >
                    {/* Expand toggle */}
                    <td className="px-2 py-3.5">
                      <motion.button
                        onClick={() => toggleExpand(inv.id)}
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="p-1 rounded text-white/20
                          hover:text-white/50 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </td>

                    {/* Invoice ID */}
                    <td className="px-4 py-3.5 pl-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-1.5 bg-indigo-500/10 rounded-lg
                          flex-shrink-0"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-white/90 text-sm font-medium">
                            {inv.id}
                          </p>
                          <p className="text-white/30 text-xs">
                            {inv.patientId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0
                          bg-gradient-to-br from-indigo-500/20 to-violet-500/20
                          border border-white/[0.08] flex items-center
                          justify-center"
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
                        {formatCurrency(inv.subtotal)}
                      </p>
                    </td>

                    {/* Tax */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-white/30 text-sm">
                        {formatCurrency(inv.tax)}
                      </p>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3.5">
                      <p className="text-white font-semibold text-sm">
                        {formatCurrency(inv.total)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs
                        font-medium px-2.5 py-1 rounded-full w-fit ${badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {inv.status}
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
                          title="View invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
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
                          className="p-1.5 rounded-lg text-white/30
                            hover:text-white/60 hover:bg-white/[0.05]
                            transition-all duration-150"
                          title="More options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Expanded invoice detail rows ── */}
      <AnimatePresence>
        {expandedId && (
          <ExpandedRow
            invoice={sorted.find((inv) => inv.id === expandedId)!}
            onClose={() => setExpandedId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
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
            {formatCurrency(sorted.reduce((s, inv) => s + inv.total, 0))}
          </span>
        </p>
      </div>
    </motion.div>
  )
}

// ── Expanded Row Component ────────────────────────────────────────
function ExpandedRow({
  invoice,
  onClose,
}: {
  invoice: Invoice
  onClose: () => void
}) {
  if (!invoice) return null

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="overflow-hidden border-t border-white/[0.06]"
    >
      <div className="px-6 py-4 bg-white/[0.01]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/60 text-xs font-medium">
            Invoice Items — {invoice.id}
          </p>
          <button
            onClick={onClose}
            className="text-white/30 text-xs hover:text-white/60
              transition-colors"
          >
            Close
          </button>
        </div>

        {/* Items table */}
        <div className="space-y-1.5">
          {/* Item header */}
          <div className="grid grid-cols-[1fr_60px_80px_80px] gap-4 px-3">
            {['Description', 'Qty', 'Price', 'Line Total'].map((h) => (
              <span key={h} className="text-white/25 text-xs font-medium">
                {h}
              </span>
            ))}
          </div>

          {/* Item rows */}
          {invoice.items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_60px_80px_80px] gap-4 px-3
                py-2 rounded-lg bg-white/[0.02]"
            >
              <span className="text-white/70 text-xs">{item.description}</span>
              <span className="text-white/50 text-xs text-center">
                {item.quantity}
              </span>
              <span className="text-white/50 text-xs">
                {formatCurrency(item.price)}
              </span>
              <span className="text-white/70 text-xs font-medium">
                {formatCurrency(item.quantity * item.price)}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="border-t border-white/[0.06] mt-2 pt-2 space-y-1">
            <div className="grid grid-cols-[1fr_80px] gap-4 px-3">
              <span className="text-white/40 text-xs text-right">
                Subtotal:
              </span>
              <span className="text-white/60 text-xs font-medium">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_80px] gap-4 px-3">
              <span className="text-white/40 text-xs text-right">Tax:</span>
              <span className="text-white/60 text-xs font-medium">
                {formatCurrency(invoice.tax)}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_80px] gap-4 px-3">
              <span className="text-white/60 text-xs text-right font-medium">
                Total:
              </span>
              <span className="text-white text-xs font-bold">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-2 px-3">
              <p className="text-white/25 text-xs">
                Note: <span className="text-white/40">{invoice.notes}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
