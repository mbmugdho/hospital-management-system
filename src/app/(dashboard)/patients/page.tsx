'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download } from 'lucide-react'
import { motion } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import SampleBanner from '@/components/shared/SampleBanner'
import PatientStatBar from '@/components/patients/PatientStatBar'
import PatientFilters from '@/components/patients/PatientFilters'
import PatientTable from '@/components/patients/PatientTable'
import AddPatientModal from '@/components/patients/AddPatientModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ToastContainer, useToast } from '@/components/shared/Toast'

import { patients as dummyPatients } from '@/data/patients'
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
  fetchPatients,
  insertPatient,
  updatePatient,
  deletePatient,
} from '@/lib/supabase/queries/patients'
import { createClient } from '@/lib/supabase/client'

import type { Patient } from '@/types'
import type { FilterStatus } from '@/components/patients/PatientFilters'

const PAGE_KEY = 'patients'

export default function PatientsPage() {
  const [allPatients, setAllPatients] = useState<WithMeta<Patient>[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('All')
  const [loading, setLoading] = useState(true)
  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WithMeta<Patient> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WithMeta<Patient> | null>(
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
      const real = await fetchPatients()
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
      setAllPatients(mergeData(dummyPatients, mapped))
    } catch {
      toast.error('Failed to load patients')
      setAllPatients(tagDummy(dummyPatients))
    } finally {
      setLoading(false)
    }
  }, [])

  const visiblePatients = allPatients.filter((p) => {
    if (p._isDummy && hideSample) return false
    if (p._isDummy && deletedDummyIds.includes(p.id)) return false
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

  function openEdit(patient: WithMeta<Patient>) {
    setEditTarget(patient)
    setModalOpen(true)
  }

  function openDelete(patient: WithMeta<Patient>) {
    setDeleteTarget(patient)
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

      const payload = {
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
          const updated = await updatePatient(editTarget.id, payload)
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
        const inserted = await insertPatient(payload, user.id)
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
        setAllPatients((prev) => [
          { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` },
          ...prev,
        ])
        toast.success('Patient added successfully')
      }

      closeModal()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save patient')
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
        setAllPatients((prev) =>
          prev.filter((p) => p._localId !== deleteTarget._localId)
        )
        toast.warning('Sample data removed — restores on refresh')
      } else {
        await deletePatient(deleteTarget.id)
        setAllPatients((prev) =>
          prev.filter((p) => p._localId !== deleteTarget._localId)
        )
        toast.success('Patient deleted permanently')
      }
      closeConfirm()
    } catch {
      toast.error('Failed to delete patient')
    } finally {
      setIsDeleting(false)
    }
  }

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

  const sampleCount = allPatients.filter(
    (p) => p._isDummy && !deletedDummyIds.includes(p.id)
  ).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
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

        <SampleBanner
          sampleCount={sampleCount}
          hideSample={hideSample}
          onToggle={toggleSample}
          onClear={handleClearSample}
        />

        <PatientStatBar patients={visiblePatients} loading={loading} />

        <PatientFilters active={filter} onChange={setFilter} />

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

      <AddPatientModal
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
        title="Delete Patient"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.name}" from the patient list?`
            : 'Remove this patient?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
