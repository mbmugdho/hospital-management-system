'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download } from 'lucide-react'
import { motion } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import SampleBanner from '@/components/shared/SampleBanner'
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

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
  }

  function closeConfirm() {
    setConfirmOpen(false)
    setDeleteTarget(null)
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

      closeModal()
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
      closeConfirm()
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

        <SampleBanner
          sampleCount={sampleCount}
          hideSample={hideSample}
          onToggle={toggleSample}
          onClear={handleClearSample}
        />

        <PharmacyStatBar medicines={visibleMedicines} loading={loading} />

        <PharmacyFilters
          medicines={visibleMedicines}
          stockFilter={stockFilter}
          categoryFilter={categoryFilter}
          onStockChange={setStockFilter}
          onCategoryChange={setCategoryFilter}
        />

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

      <AddMedicineModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editData={editTarget}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={closeConfirm}
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
