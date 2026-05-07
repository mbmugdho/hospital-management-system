'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  Package,
} from 'lucide-react'
import { medicines } from '@/data/pharmacy'
import type { Medicine } from '@/types'
import type { StockFilter, CategoryFilter } from './PharmacyFilters'

// ── Types ─────────────────────────────────────────────────────────
type SortField =
  | 'name'
  | 'category'
  | 'stock'
  | 'price'
  | 'expiryDate'
  | 'stockStatus'
type SortDir = 'asc' | 'desc'

// ── Styles ────────────────────────────────────────────────────────
const stockStyle: Record<string, string> = {
  high: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  medium: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  low: 'bg-red-500/10    text-red-400    border border-red-500/20',
}

const stockDot: Record<string, string> = {
  high: 'bg-emerald-500',
  medium: 'bg-amber-500',
  low: 'bg-red-500',
}

const stockBarColor: Record<string, string> = {
  high: 'bg-emerald-500',
  medium: 'bg-amber-500',
  low: 'bg-red-500',
}

// ── Helpers ───────────────────────────────────────────────────────
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
interface PharmacyTableProps {
  search: string
  stockFilter: StockFilter
  categoryFilter: CategoryFilter
}

// ── Component ─────────────────────────────────────────────────────
export default function PharmacyTable({
  search,
  stockFilter,
  categoryFilter,
}: PharmacyTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [today, setToday] = useState<string>('')

  // ✅ Avoid hydration mismatch with Date
  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]!)
  }, [])

  // ── Filter ──────────────────────────────────────────────────────
  const filtered: Medicine[] = medicines.filter((m) => {
    const matchStock =
      stockFilter === 'All' ||
      m.stockStatus.toLowerCase() === stockFilter.toLowerCase()

    const matchCategory =
      categoryFilter === 'All' || m.category === categoryFilter

    const q = search.toLowerCase()
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.supplier.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)

    return matchStock && matchCategory && matchSearch
  })

  // ── Sort ────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    let valA: string | number
    let valB: string | number

    if (sortField === 'stock' || sortField === 'price') {
      valA = Number(a[sortField])
      valB = Number(b[sortField])
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

  // Check if medicine is expiring soon (within 90 days)
  function isExpiringSoon(expiryDate: string): boolean {
    if (!today) return false
    const expiry = new Date(expiryDate)
    const now = new Date(today)
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 90 && diff > 0
  }

  function isExpired(expiryDate: string): boolean {
    if (!today) return false
    return new Date(expiryDate) < new Date(today)
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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
        <p className="text-white/30 text-sm">No medicines found</p>
        <p className="text-white/20 text-xs mt-1">
          Try adjusting your search or filters
        </p>
      </motion.div>
    )
  }

  // Max stock for bar width calculation
  const maxStock = Math.max(...medicines.map((m) => m.stock))

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
              <ColHeader field="name" label="Medicine" className="pl-5" />
              <ColHeader field="category" label="Category" />
              <ColHeader field="stock" label="Stock" />
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium">
                Unit
              </th>
              <ColHeader field="price" label="Price" />
              <ColHeader
                field="expiryDate"
                label="Expiry"
                className="hidden md:table-cell"
              />
              <th
                className="px-4 py-3 text-left text-white/40 text-xs
                font-medium hidden lg:table-cell"
              >
                Supplier
              </th>
              <ColHeader field="stockStatus" label="Status" />
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
              {sorted.map((med, i) => {
                const sKey = med.stockStatus.toLowerCase()
                const badge = stockStyle[sKey] ?? stockStyle.medium
                const dot = stockDot[sKey] ?? stockDot.medium
                const barColor = stockBarColor[sKey] ?? stockBarColor.medium
                const isHovered = hoveredId === med.id
                const expiring = isExpiringSoon(med.expiryDate)
                const expired = isExpired(med.expiryDate)
                const stockPct = Math.round((med.stock / maxStock) * 100)

                return (
                  <motion.tr
                    key={med.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 28,
                      delay: i * 0.03,
                    }}
                    onHoverStart={() => setHoveredId(med.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="border-b border-white/[0.04] last:border-0
                      cursor-pointer transition-colors duration-150"
                    style={{
                      backgroundColor: isHovered
                        ? 'rgba(255,255,255,0.025)'
                        : 'transparent',
                    }}
                  >
                    {/* Medicine name + ID */}
                    <td className="px-4 py-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 bg-indigo-500/10 rounded-xl
                          flex-shrink-0 border border-indigo-500/20"
                        >
                          <Package className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-white/90 text-sm font-medium">
                            {med.name}
                          </p>
                          <p className="text-white/30 text-xs">{med.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-medium px-2.5 py-1
                        rounded-lg bg-white/[0.04] text-white/50"
                      >
                        {med.category}
                      </span>
                    </td>

                    {/* Stock + bar */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <p className="text-white/80 text-sm font-medium">
                          {med.stock.toLocaleString()}
                        </p>
                        <div
                          className="w-20 h-1.5 bg-white/[0.05] rounded-full
                          overflow-hidden"
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stockPct}%` }}
                            transition={{
                              delay: 0.3 + i * 0.05,
                              duration: 0.6,
                              ease: [0.34, 1.56, 0.64, 1],
                            }}
                            className={`h-full rounded-full ${barColor} opacity-80`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="px-4 py-3.5">
                      <p className="text-white/40 text-xs">{med.unit}</p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5">
                      <p className="text-white/70 text-sm font-medium">
                        {formatCurrency(med.price)}
                      </p>
                      <p className="text-white/25 text-xs">
                        Value: {formatCurrency(med.stock * med.price)}
                      </p>
                    </td>

                    {/* Expiry */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        {(expired || expiring) && (
                          <AlertTriangle
                            className={`w-3 h-3 flex-shrink-0
                              ${expired ? 'text-red-400' : 'text-amber-400'}`}
                          />
                        )}
                        <span
                          className={`text-xs
                            ${
                              expired
                                ? 'text-red-400 font-medium'
                                : expiring
                                  ? 'text-amber-400'
                                  : 'text-white/50'
                            }`}
                        >
                          {formatDate(med.expiryDate)}
                        </span>
                      </div>
                      {expired && (
                        <p className="text-red-400/60 text-xs mt-0.5">
                          Expired
                        </p>
                      )}
                      {expiring && !expired && (
                        <p className="text-amber-400/60 text-xs mt-0.5">
                          Expiring soon
                        </p>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-white/40 text-xs">{med.supplier}</p>
                    </td>

                    {/* Stock Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs
                        font-medium px-2.5 py-1 rounded-full w-fit ${badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {med.stockStatus}
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
                          title="View details"
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
          <span className="text-white/60 font-medium">{medicines.length}</span>{' '}
          medicines
        </p>
        <p className="text-white/20 text-xs">
          Inventory:{' '}
          <span className="text-white/60 font-medium">
            {formatCurrency(sorted.reduce((s, m) => s + m.stock * m.price, 0))}
          </span>
        </p>
      </div>
    </motion.div>
  )
}
