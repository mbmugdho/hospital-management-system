'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserPlus, Download } from 'lucide-react'
import { motion } from 'framer-motion'

import PageHeader from '@/components/shared/PageHeader'
import TableSkeleton from '@/components/shared/TableSkeleton'
import SampleBanner from '@/components/shared/SampleBanner'
import StaffStatBar from '@/components/staff/StaffStatBar'
import StaffFilters from '@/components/staff/StaffFilters'
import StaffGrid from '@/components/staff/StaffGrid'
import StaffTable from '@/components/staff/StaffTable'
import AddStaffModal from '@/components/staff/AddStaffModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ToastContainer, useToast } from '@/components/shared/Toast'

import { doctors as dummyDoctors } from '@/data/doctors'
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
  fetchDoctors,
  insertDoctor,
  updateDoctor,
  deleteDoctor,
} from '@/lib/supabase/queries/doctors'
import { createClient } from '@/lib/supabase/client'

import type { Doctor } from '@/types'
import type {
  StaffRoleFilter,
  StaffStatusFilter,
  ViewMode,
} from '@/components/staff/StaffFilters'

const PAGE_KEY = 'staff'

export default function StaffPage() {
  const [allStaff, setAllStaff] = useState<WithMeta<Doctor>[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<StaffRoleFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StaffStatusFilter>('All')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [loading, setLoading] = useState(true)
  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WithMeta<Doctor> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WithMeta<Doctor> | null>(
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
      const real = await fetchDoctors()
      const mapped: Doctor[] = real.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        specialization: r.specialization,
        department: r.department,
        role: r.role as Doctor['role'],
        availability: [],
        status: r.status as Doctor['status'],
        joinedAt: r.joined_at,
      }))
      setAllStaff(mergeData(dummyDoctors, mapped))
    } catch {
      toast.error('Failed to load staff')
      setAllStaff(tagDummy(dummyDoctors))
    } finally {
      setLoading(false)
    }
  }, [])

  const visibleStaff = allStaff.filter((d) => {
    if (d._isDummy && hideSample) return false
    if (d._isDummy && deletedDummyIds.includes(d.id)) return false
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

  function openEdit(doc: WithMeta<Doctor>) {
    setEditTarget(doc)
    setModalOpen(true)
  }

  function openDelete(doc: WithMeta<Doctor>) {
    setDeleteTarget(doc)
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
    email: string
    phone: string
    specialization: string
    department: string
    role: string
    availability: string[]
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
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        department: formData.department,
        role: formData.role,
        availability: 'Full-time',
        status: formData.status,
        joined_at: new Date().toISOString(),
      }

      if (editTarget) {
        if (editTarget._isDummy) {
          setAllStaff((prev) =>
            prev.map((d) =>
              d._localId === editTarget._localId
                ? {
                    ...d,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    specialization: formData.specialization,
                    department: formData.department,
                    role: formData.role as Doctor['role'],
                    availability: formData.availability,
                    status: formData.status as Doctor['status'],
                  }
                : d
            )
          )
          toast.success('Sample data updated — resets on refresh')
        } else {
          const updated = await updateDoctor(editTarget.id, payload)
          const mapped: Doctor = {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            specialization: updated.specialization,
            department: updated.department,
            role: updated.role as Doctor['role'],
            availability: formData.availability,
            status: updated.status as Doctor['status'],
            joinedAt: updated.joined_at,
          }
          setAllStaff((prev) =>
            prev.map((d) =>
              d._localId === editTarget._localId
                ? { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` }
                : d
            )
          )
          toast.success('Staff member updated successfully')
        }
      } else {
        const inserted = await insertDoctor(payload, user.id)
        const mapped: Doctor = {
          id: inserted.id,
          name: inserted.name,
          email: inserted.email,
          phone: inserted.phone,
          specialization: inserted.specialization,
          department: inserted.department,
          role: inserted.role as Doctor['role'],
          availability: formData.availability,
          status: inserted.status as Doctor['status'],
          joinedAt: inserted.joined_at,
        }
        setAllStaff((prev) => [
          { ...mapped, _isDummy: false, _localId: `real_${mapped.id}` },
          ...prev,
        ])
        toast.success('Staff member added successfully')
      }

      closeModal()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save staff member'
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
        setAllStaff((prev) =>
          prev.filter((d) => d._localId !== deleteTarget._localId)
        )
        toast.warning('Sample data removed — restores on refresh')
      } else {
        await deleteDoctor(deleteTarget.id)
        setAllStaff((prev) =>
          prev.filter((d) => d._localId !== deleteTarget._localId)
        )
        toast.success('Staff member deleted permanently')
      }
      closeConfirm()
    } catch {
      toast.error('Failed to delete staff member')
    } finally {
      setIsDeleting(false)
    }
  }

  function handleExport() {
    const rows = visibleStaff.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      role: d.role,
      specialization: d.specialization,
      department: d.department,
      status: d.status,
      joined_at: d.joinedAt,
    }))
    exportToCSV(rows, 'staff')
    toast.success('Export downloaded successfully')
  }

  const sampleCount = allStaff.filter(
    (d) => d._isDummy && !deletedDummyIds.includes(d.id)
  ).length

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        <PageHeader
          title="Staff"
          subtitle="Manage doctors, nurses, and all hospital staff"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search by name, role, department..."
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
              <UserPlus className="w-4 h-4" />
              Add Staff
            </motion.button>
          }
        />

        <SampleBanner
          sampleCount={sampleCount}
          hideSample={hideSample}
          onToggle={toggleSample}
          onClear={handleClearSample}
        />

        <StaffStatBar staff={visibleStaff} loading={loading} />

        <StaffFilters
          staff={visibleStaff}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {loading ? (
          <TableSkeleton rows={8} cols={viewMode === 'table' ? 8 : 4} />
        ) : viewMode === 'grid' ? (
          <StaffGrid
            staff={visibleStaff}
            search={search}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        ) : (
          <StaffTable
            staff={visibleStaff}
            search={search}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      <AddStaffModal
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
        title="Delete Staff Member"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.name}" from the staff list?`
            : 'Remove this staff member?'
        }
        isDummy={deleteTarget?._isDummy ?? false}
        isLoading={isDeleting}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
