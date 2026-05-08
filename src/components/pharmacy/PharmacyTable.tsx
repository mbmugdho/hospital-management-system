'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
  AlertTriangle,
  Package,
} from 'lucide-react'
import SampleBadge from '@/components/shared/SampleBadge'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Medicine } from '@/types'
import type { StockFilter, CategoryFilter } from './PharmacyFilters'

type SortField =
  | 'name'
  | 'category'
  | 'stock'
  | 'price'
  | 'expiryDate'
  | 'stockStatus'
type SortDir = 'asc' | 'desc'

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

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
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

interface PharmacyTableProps {
  medicines: WithMeta<Medicine>[]
  search: string
  stockFilter: StockFilter
  categoryFilter: CategoryFilter
  onEdit: (med: WithMeta<Medicine>) => void
  onDelete: (med: WithMeta<Medicine>) => void
}

export default function PharmacyTable({
  medicines,
  search,
  stockFilter,
  categoryFilter,
  onEdit,
  onDelete,
}: PharmacyTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [today, setToday] = useState<string>('')

  // useEffect for Date to avoid hydration mismatch
  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]!)
  }, [])

  // Apply all three filters
  const filtered = medicines.filter((m) => {
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

  // Sort filtered results
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

  function isExpiringSoon(expiryDate: string): boolean {
    if (!today) return false
    const diff =
      (new Date(expiryDate).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24)
    return diff <= 90 && diff > 0
  }

  function isExpired(expiryDate: string): boolean {
    if (!today) return false
    return new Date(expiryDate) < new Date(today)
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
        <p className="text-white/30 text-sm">No medicines found</p>
        <p className="text-white/20 text-xs mt-1">
          Try adjusting your search or filters
        </p>
      </motion.div>
    )
  }

  // Max stock value used to compute the stock bar width percentage
  const maxStock = Math.max(...medicines.map((m) => m.stock), 1)

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
              <th className="px-4 py-3 text-left text-white/40 text-xs font-medium hidden lg:table-cell">
                Supplier
              </th>
              <ColHeader field="stockStatus" label="Status" />
              <th className="px-4 py-3 text-right text-white/40 text-xs font-medium pr-5">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/*
              Layout animation only — no entry animation on filter change.
              This is the same fix applied across all pages.
            */}
            {sorted.map((med, i) => {
              const sKey = med.stockStatus.toLowerCase()
              const badge = stockStyle[sKey] ?? stockStyle.medium
              const dot = stockDot[sKey] ?? stockDot.medium
              const barColor = stockBarColor[sKey] ?? stockBarColor.medium
              const expiring = isExpiringSoon(med.expiryDate)
              const expired = isExpired(med.expiryDate)
              const stockPct = Math.round((med.stock / maxStock) * 100)

              return (
                <motion.tr
                  key={med._localId}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="border-b border-white/[0.04] last:border-0
                    hover:bg-white/[0.025] transition-colors duration-150 cursor-pointer"
                >
                  {/* Medicine name + ID + SAMPLE badge */}
                  <td className="px-4 py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 bg-indigo-500/10 rounded-xl flex-shrink-0
                        border border-indigo-500/20"
                      >
                        <Package className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white/90 text-sm font-medium">
                            {med.name}
                          </p>
                          {med._isDummy && <SampleBadge />}
                        </div>
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

                  {/* Stock count + animated bar */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-1.5">
                      <p className="text-white/80 text-sm font-medium">
                        {med.stock.toLocaleString()}
                      </p>
                      <div className="w-20 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPct}%` }}
                          transition={{
                            delay: 0.3 + i * 0.04,
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

                  {/* Price + total value */}
                  <td className="px-4 py-3.5">
                    <p className="text-white/70 text-sm font-medium">
                      {formatCurrency(med.price)}
                    </p>
                    <p className="text-white/25 text-xs">
                      Value: {formatCurrency(med.stock * med.price)}
                    </p>
                  </td>

                  {/* Expiry date + warning */}
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
                      <p className="text-red-400/60 text-xs mt-0.5">Expired</p>
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

                  {/* Stock status badge */}
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
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(med)
                        }}
                        className="p-1.5 rounded-lg text-white/30
                          hover:text-indigo-400 hover:bg-indigo-500/10
                          transition-all duration-150"
                        title="Edit medicine"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(med)
                        }}
                        className="p-1.5 rounded-lg text-white/30
                          hover:text-red-400 hover:bg-red-500/10
                          transition-all duration-150"
                        title="Delete medicine"
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
