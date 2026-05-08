'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, EyeOff, Eye, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import PatientStatBar from '@/components/patients/PatientStatBar'
import PatientFilters from '@/components/patients/PatientFilters'
import PatientTable from '@/components/patients/PatientTable'
import AddPatientModal from '@/components/patients/AddPatientModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ToastContainer, useToast } from '@/components/shared/Toast'

import { patients as dummyPatients } from '@/data/patients'
import { mergeData, tagDummy, tagReal } from '@/lib/utils/mergeData'
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
  fetchPatients,
  insertPatient,
  updatePatient,
  deletePatient,
} from '@/lib/supabase/queries/patients'
import { createClient } from '@/lib/supabase/client'

import type { Patient } from '@/types'
import type { FilterStatus } from '@/components/patients/PatientFilters'

// Page key used for localStorage/sessionStorage scoping
const PAGE_KEY = 'patients'

export default function PatientsPage() {
  // Core state
  const [allPatients, setAllPatients] = useState<WithMeta<Patient>[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('All')
  const [loading, setLoading] = useState(true)

  // Sample data controls
  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WithMeta<Patient> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Delete confirm state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WithMeta<Patient> | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const { toasts, removeToast, toast } = useToast()

  // Load storage values and fetch real data on mount
  useEffect(() => {
    const hidden = getSampleHidden(PAGE_KEY)
    const deleted = getDeletedDummyIds(PAGE_KEY)
    setHideSample(hidden)
    setDeletedDummyIds(deleted)
    loadData()
  }, [])

  // Fetch real patients from Supabase and merge with dummy data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const real = await fetchPatients()

      // Map Supabase snake_case columns to Patient type camelCase fields
      const mapped: Patient[] = real.map((r) => ({
        id: r.id,
        name: r.name,
        age: r.age,
        gender: r.gender,
        bloodGroup: r.blood_group,
        phone: r.phone,
        email: r.email,
        address: r.address,
        emergencyContact: r.emergency_contact,
        assignedDoctor: r.assigned_doctor,
        status: r.status as Patient['status'],
        registeredAt: r.registered_at,
      }))

      // Merge: real rows first, then dummy rows at the bottom
      setAllPatients(mergeData(dummyPatients, mapped))
    } catch {
      toast.error('Failed to load patients')
      // Fallback to dummy data only so the page is never empty
      setAllPatients(tagDummy(dummyPatients))
    } finally {
      setLoading(false)
    }
  }, [])

  // Compute visible patients applying sample filters
  const visiblePatients = allPatients.filter((p) => {
    if (p._isDummy && hideSample) return false
    if (p._isDummy && deletedDummyIds.includes(p.id)) return false
    return true
  })

  // Toggle hide/show sample data
  function toggleSample() {
    const next = !hideSample
    setHideSample(next)
    setSampleHidden(PAGE_KEY, next)
  }

  // Clear all sample data for this session
  function handleClearSample() {
    clearDeletedDummyIds(PAGE_KEY)
    setDeletedDummyIds([])
    setSampleHidden(PAGE_KEY, true)
    setHideSample(true)
    toast.info('Sample data hidden — refresh to restore')
  }

  // Open add modal
  function openAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }

  // Open edit modal
  function openEdit(patient: WithMeta<Patient>) {
    setEditTarget(patient)
    setModalOpen(true)
  }

  // Open delete confirm
  function openDelete(patient: WithMeta<Patient>) {
    setDeleteTarget(patient)
    setConfirmOpen(true)
  }

  // Save handler — add or edit
  async function handleSave(formData: {
    name: string
    age: string
    gender: string
    bloodGroup: string
    phone: string
    email: string
    address: string
    emergencyContact: string
    assignedDoctor: string
    status: string
  }) {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const patientPayload = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        blood_group: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergency_contact: formData.emergencyContact,
        assigned_doctor: formData.assignedDoctor,
        status: formData.status,
        registered_at: new Date().toISOString(),
      }

      if (editTarget) {
        if (editTarget._isDummy) {
          // Edit dummy row — update local state only
          setAllPatients((prev) =>
            prev.map((p) =>
              p._localId === editTarget._localId
                ? {
                    ...p,
                    name: formData.name,
                    age: Number(formData.age),
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    emergencyContact: formData.emergencyContact,
                    assignedDoctor: formData.assignedDoctor,
                    status: formData.status as Patient['status'],
                  }
                : p
            )
          )
          toast.success('Sample data updated — resets on refresh')
        } else {
          // Edit real row — update Supabase
          const updated = await updatePatient(editTarget.id, patientPayload)
          const mapped: Patient = {
            id: updated.id,
            name: updated.name,
            age: updated.age,
            gender: updated.gender,
            bloodGroup: updated.blood_group,
            phone: updated.phone,
            email: updated.email,
            address: updated.address,
            emergencyContact: updated.emergency_contact,
            assignedDoctor: updated.assigned_doctor,
            status: updated.status as Patient['status'],
            registeredAt: updated.registered_at,
          }
          setAllPatients((prev) =>
            prev.map((p) =>
              p._localId === editTarget._localId
                ? { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` }
                : p
            )
          )
          toast.success('Patient updated successfully')
        }
      } else {
        // Add new real patient — always goes to Supabase
        const inserted = await insertPatient(patientPayload, user.id)
        const mapped: Patient = {
          id: inserted.id,
          name: inserted.name,
          age: inserted.age,
          gender: inserted.gender,
          bloodGroup: inserted.blood_group,
          phone: inserted.phone,
          email: inserted.email,
          address: inserted.address,
          emergencyContact: inserted.emergency_contact,
          assignedDoctor: inserted.assigned_doctor,
          status: inserted.status as Patient['status'],
          registeredAt: inserted.registered_at,
        }
        // Prepend real row to top of list
        setAllPatients((prev) => [
          { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` },
          ...prev,
        ])
        toast.success('Patient added successfully')
      }

      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save patient')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete handler
  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      if (deleteTarget._isDummy) {
        // Remove dummy row from session view
        addDeletedDummyId(PAGE_KEY, deleteTarget.id)
        setDeletedDummyIds((prev) => [...prev, deleteTarget.id])
        setAllPatients((prev) =>
          prev.filter((p) => p._localId !== deleteTarget._localId)
        )
        toast.warning('Sample data removed — restores on refresh')
      } else {
        // Permanently delete real row from Supabase
        await deletePatient(deleteTarget.id)
        setAllPatients((prev) =>
          prev.filter((p) => p._localId !== deleteTarget._localId)
        )
        toast.success('Patient deleted permanently')
      }
      setConfirmOpen(false)
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete patient')
    } finally {
      setIsDeleting(false)
    }
  }

  // Export visible filtered patients as CSV
  function handleExport() {
    const rows = visiblePatients.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      blood_group: p.bloodGroup,
      phone: p.phone,
      email: p.email,
      address: p.address,
      emergency_contact: p.emergencyContact,
      assigned_doctor: p.assignedDoctor,
      status: p.status,
      registered_at: p.registeredAt,
    }))
    exportToCSV(rows, 'patients')
    toast.success('Export downloaded successfully')
  }

  // Sample data counts for the banner
  const sampleCount = allPatients.filter(
    (p) => p._isDummy && !deletedDummyIds.includes(p.id)
  ).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Patients"
          subtitle="Manage and monitor all registered patients"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search patients, doctors, IDs..."
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
              Add Patient
            </motion.button>
          }
        />

        {/* Sample data control banner */}
        <AnimatePresence>
          {!hideSample && sampleCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="flex items-center justify-between gap-4
                px-4 py-3 bg-indigo-500/[0.06] border border-indigo-500/[0.15]
                rounded-xl"
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

          {/* Restore banner shown when sample data is hidden */}
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

        {/* Stat bar — loading skeleton or live counts */}
        <PatientStatBar patients={visiblePatients} loading={loading} />

        {/* Filters */}
        <PatientFilters active={filter} onChange={setFilter} />

        {/* Table or skeleton */}
        {loading ? (
          <TableSkeleton rows={8} cols={8} />
        ) : (
          <PatientTable
            patients={visiblePatients}
            search={search}
            filter={filter}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* Add / Edit modal */}
      <AddPatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editData={editTarget}
        isSaving={isSaving}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.name}" from the patient list?`
            : 'Remove this patient?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

// Patients page — full migration with Supabase CRUD + dummy data hybrid.
// Fetches real data from Supabase on mount, merges with dummy data.
// Handles add, edit, delete for both dummy and real rows.
// Exports visible filtered data as CSV.
