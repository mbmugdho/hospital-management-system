'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, EyeOff, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import BillingStatBar from '@/components/billing/BillingStatBar'
import BillingFilters from '@/components/billing/BillingFilters'
import BillingTable from '@/components/billing/BillingTable'
import AddInvoiceModal from '@/components/billing/AddInvoiceModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ToastContainer, useToast } from '@/components/shared/Toast'

import { invoices as dummyInvoices } from '@/data/billing'
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
import { exportToPDF } from '@/lib/utils/exportPDF'
import {
  fetchInvoices,
  insertInvoice,
  updateInvoice,
  deleteInvoice,
} from '@/lib/supabase/queries/billing'
import { createClient } from '@/lib/supabase/client'

import type { Invoice } from '@/types'
import type { BillingFilterStatus } from '@/components/billing/BillingFilters'

const PAGE_KEY = 'billing'

export default function BillingPage() {
  const [allInvoices, setAllInvoices] = useState<WithMeta<Invoice>[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<BillingFilterStatus>('All')
  const [loading, setLoading] = useState(true)

  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WithMeta<Invoice> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WithMeta<Invoice> | null>(
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
      const real = await fetchInvoices()

      // Map Supabase rows to Invoice type — items come from invoice_items join
      const mapped: Invoice[] = real.map((r) => ({
        id: r.id,
        patientId: r.patient_id ?? '',
        patient: r.patient_name,
        date: r.date,
        items: (r.items ?? []).map((it) => ({
          description: it.description,
          quantity: it.quantity,
          price: it.price,
        })),
        subtotal: r.subtotal,
        tax: r.tax,
        total: r.total,
        status: r.status as Invoice['status'],
        notes: r.notes,
      }))

      setAllInvoices(mergeData(dummyInvoices, mapped))
    } catch {
      toast.error('Failed to load invoices')
      setAllInvoices(tagDummy(dummyInvoices))
    } finally {
      setLoading(false)
    }
  }, [])

  const visibleInvoices = allInvoices.filter((inv) => {
    if (inv._isDummy && hideSample) return false
    if (inv._isDummy && deletedDummyIds.includes(inv.id)) return false
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

  function openEdit(inv: WithMeta<Invoice>) {
    setEditTarget(inv)
    setModalOpen(true)
  }

  function openDelete(inv: WithMeta<Invoice>) {
    setDeleteTarget(inv)
    setConfirmOpen(true)
  }

  async function handleSave(
    formData: {
      patient: string
      patientId: string
      date: string
      status: string
      notes: string
      items: { description: string; quantity: number; price: number }[]
    },
    subtotal: number,
    tax: number,
    total: number
  ) {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const invoicePayload = {
        patient_name: formData.patient,
        patient_id: formData.patientId || null,
        date: formData.date,
        subtotal,
        tax,
        total,
        status: formData.status,
        notes: formData.notes,
      }

      const itemsPayload = formData.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        price: it.price,
      }))

      if (editTarget) {
        if (editTarget._isDummy) {
          // Update dummy invoice in local state only
          setAllInvoices((prev) =>
            prev.map((inv) =>
              inv._localId === editTarget._localId
                ? {
                    ...inv,
                    patient: formData.patient,
                    patientId: formData.patientId,
                    date: formData.date,
                    items: formData.items,
                    subtotal,
                    tax,
                    total,
                    status: formData.status as Invoice['status'],
                    notes: formData.notes,
                  }
                : inv
            )
          )
          toast.success('Sample data updated — resets on refresh')
        } else {
          // Update real invoice in Supabase
          await updateInvoice(editTarget.id, invoicePayload, itemsPayload)
          setAllInvoices((prev) =>
            prev.map((inv) =>
              inv._localId === editTarget._localId
                ? {
                    ...inv,
                    patient: formData.patient,
                    patientId: formData.patientId,
                    date: formData.date,
                    items: formData.items,
                    subtotal,
                    tax,
                    total,
                    status: formData.status as Invoice['status'],
                    notes: formData.notes,
                  }
                : inv
            )
          )
          toast.success('Invoice updated successfully')
        }
      } else {
        // Insert new real invoice
        const inserted = await insertInvoice(
          invoicePayload,
          itemsPayload,
          user.id
        )
        const newInvoice: Invoice = {
          id: inserted.id,
          patientId: inserted.patient_id ?? '',
          patient: inserted.patient_name,
          date: inserted.date,
          items: formData.items,
          subtotal: inserted.subtotal,
          tax: inserted.tax,
          total: inserted.total,
          status: inserted.status as Invoice['status'],
          notes: inserted.notes,
        }
        setAllInvoices((prev) => [
          { ...newInvoice, _isDummy: false, _localId: `real_${newInvoice.id}` },
          ...prev,
        ])
        toast.success('Invoice created successfully')
      }

      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save invoice')
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
        setAllInvoices((prev) =>
          prev.filter((inv) => inv._localId !== deleteTarget._localId)
        )
        toast.warning('Sample data removed — restores on refresh')
      } else {
        await deleteInvoice(deleteTarget.id)
        setAllInvoices((prev) =>
          prev.filter((inv) => inv._localId !== deleteTarget._localId)
        )
        toast.success('Invoice deleted permanently')
      }
      setConfirmOpen(false)
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete invoice')
    } finally {
      setIsDeleting(false)
    }
  }

  // Export individual invoice as PDF
  function handleExportInvoice(inv: WithMeta<Invoice>) {
    exportToPDF({
      hospitalName: 'MediCore Hospital',
      reportTitle: `Invoice ${inv.id}`,
      generatedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      summary: [
        { label: 'Patient', value: inv.patient },
        { label: 'Date', value: inv.date },
        { label: 'Status', value: inv.status },
        { label: 'Subtotal', value: `$${inv.subtotal.toFixed(2)}` },
        { label: 'Tax', value: `$${inv.tax.toFixed(2)}` },
        { label: 'Total', value: `$${inv.total.toFixed(2)}` },
      ],
      sections: [
        {
          title: 'Line Items',
          headers: ['Description', 'Quantity', 'Unit Price', 'Line Total'],
          rows: inv.items.map((it) => [
            it.description,
            String(it.quantity),
            `$${it.price.toFixed(2)}`,
            `$${(it.quantity * it.price).toFixed(2)}`,
          ]),
        },
      ],
    })
    toast.success('Invoice PDF generated')
  }

  // Export all visible invoices as CSV
  function handleExportCSV() {
    const rows = visibleInvoices.map((inv) => ({
      id: inv.id,
      patient: inv.patient,
      patient_id: inv.patientId,
      date: inv.date,
      subtotal: inv.subtotal,
      tax: inv.tax,
      total: inv.total,
      status: inv.status,
      notes: inv.notes ?? '',
    }))
    exportToCSV(rows, 'billing')
    toast.success('Export downloaded successfully')
  }

  const sampleCount = allInvoices.filter(
    (inv) => inv._isDummy && !deletedDummyIds.includes(inv.id)
  ).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Billing"
          subtitle="Manage invoices, payments, and revenue tracking"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search invoice, patient..."
          exportButton={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2
                bg-white/[0.04] border border-white/[0.08] rounded-xl
                text-white/60 text-sm font-medium
                hover:bg-white/[0.08] hover:text-white/80
                transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
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
              New Invoice
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
        <BillingStatBar invoices={visibleInvoices} loading={loading} />

        {/* Filters */}
        <BillingFilters active={filter} onChange={setFilter} />

        {/* Table or skeleton */}
        {loading ? (
          <TableSkeleton rows={8} cols={9} />
        ) : (
          <BillingTable
            invoices={visibleInvoices}
            search={search}
            filter={filter}
            onEdit={openEdit}
            onDelete={openDelete}
            onExportInvoice={handleExportInvoice}
          />
        )}
      </div>

      {/* Add / Edit modal */}
      <AddInvoiceModal
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
        title="Delete Invoice"
        message={
          deleteTarget
            ? `Delete invoice "${deleteTarget.id}" for "${deleteTarget.patient}"?`
            : 'Delete this invoice?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
