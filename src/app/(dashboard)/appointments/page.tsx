'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, EyeOff, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
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

      // Map Supabase snake_case to Appointment type camelCase fields
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

  // Apply sample visibility filters
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
          // Update dummy row in local state only
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
          // Update real row in Supabase
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
        // Insert new real appointment
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

      setModalOpen(false)
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
      setConfirmOpen(false)
      setDeleteTarget(null)
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
        {/* Header */}
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
        <AppointmentStatBar
          appointments={visibleAppointments}
          loading={loading}
        />

        {/* Filters */}
        <AppointmentFilters
          active={filter}
          onChange={setFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
        />

        {/* Table or skeleton */}
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

      {/* Add / Edit modal */}
      <AddAppointmentModal
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
        title="Delete Appointment"
        message={
          deleteTarget
            ? `Remove appointment for "${deleteTarget.patient}"?`
            : 'Remove this appointment?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
