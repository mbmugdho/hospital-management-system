'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, EyeOff, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import PharmacyStatBar from '@/components/pharmacy/PharmacyStatBar'
import PharmacyFilters from '@/components/pharmacy/PharmacyFilters'
import PharmacyTable from '@/components/pharmacy/PharmacyTable'
import AddMedicineModal from '@/components/pharmacy/AddMedicineModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ToastContainer, useToast } from '@/components/shared/Toast'

import { medicines as dummyMedicines } from '@/data/pharmacy'
import { mergeData, tagDummy } from '@/lib/utils/mergeData'
import type { WithMeta } from '@/lib/utils/mergeData'
import {
  getSampleHidden,
  setSampleHidden,
  getDeletedDummyIds,
  addDeletedDummyId,
  clearDeletedDummyIds,
} from '@/lib/utils/sampleStorage'
import { exportToCSV } from '@/lib/utils/exportCSV'
import {
  fetchMedicines,
  insertMedicine,
  updateMedicine,
  deleteMedicine,
} from '@/lib/supabase/queries/pharmacy'
import { createClient } from '@/lib/supabase/client'

import type { Medicine } from '@/types'
import type {
  StockFilter,
  CategoryFilter,
} from '@/components/pharmacy/PharmacyFilters'

const PAGE_KEY = 'pharmacy'

export default function PharmacyPage() {
  const [allMedicines, setAllMedicines] = useState<WithMeta<Medicine>[]>([])
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<StockFilter>('All')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')
  const [loading, setLoading] = useState(true)

  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WithMeta<Medicine> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WithMeta<Medicine> | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const { toasts, removeToast, toast } = useToast()

  useEffect(() => {
    setHideSample(getSampleHidden(PAGE_KEY))
    setDeletedDummyIds(getDeletedDummyIds(PAGE_KEY))
    loadData()
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const real = await fetchMedicines()

      // Map Supabase snake_case columns to Medicine type camelCase fields
      const mapped: Medicine[] = real.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        stock: r.stock,
        unit: r.unit,
        price: r.price,
        expiryDate: r.expiry_date,
        supplier: r.supplier,
        stockStatus: r.stock_status as Medicine['stockStatus'],
      }))

      setAllMedicines(mergeData(dummyMedicines, mapped))
    } catch {
      toast.error('Failed to load medicines')
      setAllMedicines(tagDummy(dummyMedicines))
    } finally {
      setLoading(false)
    }
  }, [])

  // Apply sample visibility filters
  const visibleMedicines = allMedicines.filter((m) => {
    if (m._isDummy && hideSample) return false
    if (m._isDummy && deletedDummyIds.includes(m.id)) return false
    return true
  })

  function toggleSample() {
    const next = !hideSample
    setHideSample(next)
    setSampleHidden(PAGE_KEY, next)
  }

  function handleClearSample() {
    clearDeletedDummyIds(PAGE_KEY)
    setDeletedDummyIds([])
    setSampleHidden(PAGE_KEY, true)
    setHideSample(true)
    toast.info('Sample data hidden — refresh to restore')
  }

  function openAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(med: WithMeta<Medicine>) {
    setEditTarget(med)
    setModalOpen(true)
  }

  function openDelete(med: WithMeta<Medicine>) {
    setDeleteTarget(med)
    setConfirmOpen(true)
  }

  async function handleSave(formData: {
    name: string
    category: string
    stock: string
    unit: string
    price: string
    expiryDate: string
    supplier: string
    stockStatus: string
  }) {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const payload = {
        name: formData.name,
        category: formData.category,
        stock: Number(formData.stock),
        unit: formData.unit,
        price: Number(formData.price),
        expiry_date: formData.expiryDate,
        supplier: formData.supplier,
        stock_status: formData.stockStatus,
      }

      if (editTarget) {
        if (editTarget._isDummy) {
          // Update dummy medicine in local state only
          setAllMedicines((prev) =>
            prev.map((m) =>
              m._localId === editTarget._localId
                ? {
                    ...m,
                    name: formData.name,
                    category: formData.category,
                    stock: Number(formData.stock),
                    unit: formData.unit,
                    price: Number(formData.price),
                    expiryDate: formData.expiryDate,
                    supplier: formData.supplier,
                    stockStatus:
                      formData.stockStatus as Medicine['stockStatus'],
                  }
                : m
            )
          )
          toast.success('Sample data updated — resets on refresh')
        } else {
          // Update real medicine in Supabase
          const updated = await updateMedicine(editTarget.id, payload)
          const mapped: Medicine = {
            id: updated.id,
            name: updated.name,
            category: updated.category,
            stock: updated.stock,
            unit: updated.unit,
            price: updated.price,
            expiryDate: updated.expiry_date,
            supplier: updated.supplier,
            stockStatus: updated.stock_status as Medicine['stockStatus'],
          }
          setAllMedicines((prev) =>
            prev.map((m) =>
              m._localId === editTarget._localId
                ? { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` }
                : m
            )
          )
          toast.success('Medicine updated successfully')
        }
      } else {
        // Insert new real medicine
        const inserted = await insertMedicine(payload, user.id)
        const mapped: Medicine = {
          id: inserted.id,
          name: inserted.name,
          category: inserted.category,
          stock: inserted.stock,
          unit: inserted.unit,
          price: inserted.price,
          expiryDate: inserted.expiry_date,
          supplier: inserted.supplier,
          stockStatus: inserted.stock_status as Medicine['stockStatus'],
        }
        setAllMedicines((prev) => [
          { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` },
          ...prev,
        ])
        toast.success('Medicine added successfully')
      }

      setModalOpen(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save medicine'
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      if (deleteTarget._isDummy) {
        addDeletedDummyId(PAGE_KEY, deleteTarget.id)
        setDeletedDummyIds((prev) => [...prev, deleteTarget.id])
        setAllMedicines((prev) =>
          prev.filter((m) => m._localId !== deleteTarget._localId)
        )
        toast.warning('Sample data removed — restores on refresh')
      } else {
        await deleteMedicine(deleteTarget.id)
        setAllMedicines((prev) =>
          prev.filter((m) => m._localId !== deleteTarget._localId)
        )
        toast.success('Medicine deleted permanently')
      }
      setConfirmOpen(false)
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete medicine')
    } finally {
      setIsDeleting(false)
    }
  }

  function handleExport() {
    const rows = visibleMedicines.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      stock: m.stock,
      unit: m.unit,
      price: m.price,
      expiry_date: m.expiryDate,
      supplier: m.supplier,
      stock_status: m.stockStatus,
      total_value: (m.stock * m.price).toFixed(2),
    }))
    exportToCSV(rows, 'pharmacy')
    toast.success('Export downloaded successfully')
  }

  const sampleCount = allMedicines.filter(
    (m) => m._isDummy && !deletedDummyIds.includes(m.id)
  ).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Pharmacy"
          subtitle="Manage medicine inventory, stock levels, and suppliers"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search medicine, category, supplier..."
          exportButton={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2
                bg-white/[0.04] border border-white/[0.08] rounded-xl
                text-white/60 text-sm font-medium
                hover:bg-white/[0.08] hover:text-white/80
                transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          }
          action={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-white
                text-black rounded-xl text-sm font-medium
                hover:bg-white/90 transition-colors duration-200
                whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </motion.button>
          }
        />

        {/* Sample data banner */}
        <AnimatePresence>
          {!hideSample && sampleCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="flex items-center justify-between gap-4
                px-4 py-3 bg-indigo-500/[0.06] border border-indigo-500/[0.15] rounded-xl"
            >
              <p className="text-indigo-300/80 text-sm">
                <span className="font-semibold text-indigo-300">
                  {sampleCount} sample records
                </span>{' '}
                are visible. These reset on page refresh.
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleClearSample}
                  className="text-xs text-indigo-400 hover:text-indigo-300
                    px-3 py-1.5 rounded-lg border border-indigo-500/20
                    hover:border-indigo-500/40 transition-all duration-150"
                >
                  Clear Sample Data
                </button>
                <button
                  onClick={toggleSample}
                  className="text-xs text-white/40 hover:text-white/60
                    px-3 py-1.5 rounded-lg border border-white/[0.08]
                    hover:border-white/[0.14] transition-all duration-150
                    flex items-center gap-1.5"
                >
                  <EyeOff className="w-3 h-3" />
                  Hide
                </button>
              </div>
            </motion.div>
          )}

          {hideSample && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="flex items-center justify-between gap-4
                px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl"
            >
              <p className="text-white/40 text-sm">Sample data is hidden.</p>
              <button
                onClick={toggleSample}
                className="text-xs text-indigo-400 hover:text-indigo-300
                  px-3 py-1.5 rounded-lg border border-indigo-500/20
                  hover:border-indigo-500/40 transition-all duration-150
                  flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3" />
                Show Sample Data
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat bar */}
        <PharmacyStatBar medicines={visibleMedicines} loading={loading} />

        {/* Filters */}
        <PharmacyFilters
          medicines={visibleMedicines}
          stockFilter={stockFilter}
          categoryFilter={categoryFilter}
          onStockChange={setStockFilter}
          onCategoryChange={setCategoryFilter}
        />

        {/* Table or skeleton */}
        {loading ? (
          <TableSkeleton rows={8} cols={9} />
        ) : (
          <PharmacyTable
            medicines={visibleMedicines}
            search={search}
            stockFilter={stockFilter}
            categoryFilter={categoryFilter}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* Add / Edit modal */}
      <AddMedicineModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editData={editTarget}
        isSaving={isSaving}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleDelete}
        title="Delete Medicine"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.name}" from the pharmacy inventory?`
            : 'Remove this medicine?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
