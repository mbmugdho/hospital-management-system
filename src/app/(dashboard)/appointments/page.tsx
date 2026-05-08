'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download } from 'lucide-react'
import { motion } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import SampleBanner from '@/components/shared/SampleBanner'
import AppointmentStatBar from '@/components/appointments/AppointmentStatBar'
import AppointmentFilters from '@/components/appointments/AppointmentFilters'
import AppointmentTable from '@/components/appointments/AppointmentTable'
import AddAppointmentModal from '@/components/appointments/AddAppointmentModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ToastContainer, useToast } from '@/components/shared/Toast'

import { appointments as dummyAppointments } from '@/data/appointments'
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
  fetchAppointments,
  insertAppointment,
  updateAppointment,
  deleteAppointment,
} from '@/lib/supabase/queries/appointments'
import { createClient } from '@/lib/supabase/client'

import type { Appointment } from '@/types'
import type { AppointmentFilterStatus } from '@/components/appointments/AppointmentFilters'

const PAGE_KEY = 'appointments'

export default function AppointmentsPage() {
  const [allAppointments, setAllAppointments] = useState<
    WithMeta<Appointment>[]
  >([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<AppointmentFilterStatus>('All')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WithMeta<Appointment> | null>(
    null
  )
  const [isSaving, setIsSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] =
    useState<WithMeta<Appointment> | null>(null)
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
      const real = await fetchAppointments()
      const mapped: Appointment[] = real.map((r) => ({
        id: r.id,
        patientId: r.patient_id ?? '',
        patient: r.patient_name,
        doctorId: r.doctor_id ?? '',
        doctor: r.doctor_name,
        date: r.date,
        time: r.time,
        type: r.type,
        status: r.status as Appointment['status'],
        notes: r.notes,
      }))
      setAllAppointments(mergeData(dummyAppointments, mapped))
    } catch {
      toast.error('Failed to load appointments')
      setAllAppointments(tagDummy(dummyAppointments))
    } finally {
      setLoading(false)
    }
  }, [])

  const visibleAppointments = allAppointments.filter((a) => {
    if (a._isDummy && hideSample) return false
    if (a._isDummy && deletedDummyIds.includes(a.id)) return false
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

  function openEdit(appt: WithMeta<Appointment>) {
    setEditTarget(appt)
    setModalOpen(true)
  }

  function openDelete(appt: WithMeta<Appointment>) {
    setDeleteTarget(appt)
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
    patient: string
    patientId: string
    doctor: string
    doctorId: string
    date: string
    time: string
    type: string
    status: string
    notes: string
  }) {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const payload = {
        patient_name: formData.patient,
        patient_id: formData.patientId || null,
        doctor_name: formData.doctor,
        doctor_id: formData.doctorId || null,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: formData.status,
        notes: formData.notes,
      }

      if (editTarget) {
        if (editTarget._isDummy) {
          setAllAppointments((prev) =>
            prev.map((a) =>
              a._localId === editTarget._localId
                ? {
                    ...a,
                    patient: formData.patient,
                    patientId: formData.patientId,
                    doctor: formData.doctor,
                    doctorId: formData.doctorId,
                    date: formData.date,
                    time: formData.time,
                    type: formData.type,
                    status: formData.status as Appointment['status'],
                    notes: formData.notes,
                  }
                : a
            )
          )
          toast.success('Sample data updated — resets on refresh')
        } else {
          const updated = await updateAppointment(editTarget.id, payload)
          const mapped: Appointment = {
            id: updated.id,
            patientId: updated.patient_id ?? '',
            patient: updated.patient_name,
            doctorId: updated.doctor_id ?? '',
            doctor: updated.doctor_name,
            date: updated.date,
            time: updated.time,
            type: updated.type,
            status: updated.status as Appointment['status'],
            notes: updated.notes,
          }
          setAllAppointments((prev) =>
            prev.map((a) =>
              a._localId === editTarget._localId
                ? { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` }
                : a
            )
          )
          toast.success('Appointment updated successfully')
        }
      } else {
        const inserted = await insertAppointment(payload, user.id)
        const mapped: Appointment = {
          id: inserted.id,
          patientId: inserted.patient_id ?? '',
          patient: inserted.patient_name,
          doctorId: inserted.doctor_id ?? '',
          doctor: inserted.doctor_name,
          date: inserted.date,
          time: inserted.time,
          type: inserted.type,
          status: inserted.status as Appointment['status'],
          notes: inserted.notes,
        }
        setAllAppointments((prev) => [
          { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` },
          ...prev,
        ])
        toast.success('Appointment booked successfully')
      }

      closeModal()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save appointment'
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
        setAllAppointments((prev) =>
          prev.filter((a) => a._localId !== deleteTarget._localId)
        )
        toast.warning('Sample data removed — restores on refresh')
      } else {
        await deleteAppointment(deleteTarget.id)
        setAllAppointments((prev) =>
          prev.filter((a) => a._localId !== deleteTarget._localId)
        )
        toast.success('Appointment deleted permanently')
      }
      closeConfirm()
    } catch {
      toast.error('Failed to delete appointment')
    } finally {
      setIsDeleting(false)
    }
  }

  function handleExport() {
    const rows = visibleAppointments.map((a) => ({
      id: a.id,
      patient: a.patient,
      patient_id: a.patientId,
      doctor: a.doctor,
      doctor_id: a.doctorId,
      date: a.date,
      time: a.time,
      type: a.type,
      status: a.status,
      notes: a.notes ?? '',
    }))
    exportToCSV(rows, 'appointments')
    toast.success('Export downloaded successfully')
  }

  const sampleCount = allAppointments.filter(
    (a) => a._isDummy && !deletedDummyIds.includes(a.id)
  ).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        <PageHeader
          title="Appointments"
          subtitle="Schedule and manage all patient appointments"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search patient, doctor, type..."
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
              New Appointment
            </motion.button>
          }
        />

        <SampleBanner
          sampleCount={sampleCount}
          hideSample={hideSample}
          onToggle={toggleSample}
          onClear={handleClearSample}
        />

        <AppointmentStatBar
          appointments={visibleAppointments}
          loading={loading}
        />

        <AppointmentFilters
          active={filter}
          onChange={setFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
        />

        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : (
          <AppointmentTable
            appointments={visibleAppointments}
            search={search}
            filter={filter}
            dateFilter={dateFilter}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      <AddAppointmentModal
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
        title="Delete Appointment"
        message={
          deleteTarget
            ? `Remove appointment for "${deleteTarget.patient}"?`
            : 'Remove this appointment?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
