'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/shared/Modal'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Doctor } from '@/types'

interface StaffFormData {
  name: string
  email: string
  phone: string
  specialization: string
  department: string
  role: string
  availability: string[]
  status: string
}

const EMPTY_FORM: StaffFormData = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  department: '',
  role: 'Doctor',
  availability: [],
  status: 'Active',
}

const ROLE_OPTIONS = [
  'Doctor',
  'Nurse',
  'Pharmacist',
  'Receptionist',
  'Lab Technician',
]
const STATUS_OPTIONS = ['Active', 'On Leave', 'Inactive']
const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: StaffFormData) => Promise<void>
  editData?: WithMeta<Doctor> | null
  isSaving: boolean
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-white/50 mb-1.5">
      {children}
    </label>
  )
}

const inputClass = `
  w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white/80 text-sm placeholder:text-white/20
  outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
`

const selectClass = `
  w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white/80 text-sm outline-none
  focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
  [&>option]:bg-[#0A0A0A] [&>option]:text-white/80
`

export default function AddStaffModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isSaving,
}: AddStaffModalProps) {
  const [form, setForm] = useState<StaffFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<
    Partial<Record<keyof StaffFormData, string>>
  >({})

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        specialization: editData.specialization,
        department: editData.department,
        role: editData.role,
        availability: editData.availability,
        status: editData.status,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editData, isOpen])

  function set(field: keyof StaffFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function toggleDay(day: string) {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof StaffFormData, string>> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave(form)
  }

  const isEdit = !!editData

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Staff Member' : 'Add New Staff'}
      subtitle={
        isEdit
          ? editData?._isDummy
            ? 'Editing sample data — changes apply this session only'
            : 'Changes will be saved permanently'
          : 'Staff member will be added to your hospital records'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <Label>Full Name *</Label>
          <input
            className={inputClass}
            placeholder="Dr. Jane Smith"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Email *</Label>
            <input
              type="email"
              className={inputClass}
              placeholder="jane.smith@hospital.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label>Phone *</Label>
            <input
              className={inputClass}
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Role + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Role</Label>
            <select
              className={selectClass}
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specialization + Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Specialization</Label>
            <input
              className={inputClass}
              placeholder="Cardiologist"
              value={form.specialization}
              onChange={(e) => set('specialization', e.target.value)}
            />
          </div>
          <div>
            <Label>Department</Label>
            <input
              className={inputClass}
              placeholder="Cardiology"
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
            />
          </div>
        </div>

        {/* Availability day picker */}
        <div>
          <Label>Availability</Label>
          <div className="flex items-center gap-2 flex-wrap">
            {DAYS.map((day) => {
              const isOn = form.availability.includes(day)
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border
                    transition-all duration-150
                    ${
                      isOn
                        ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                        : 'bg-white/[0.03] text-white/30 border-white/[0.06] hover:border-white/[0.12] hover:text-white/50'
                    }`}
                >
                  {day.slice(0, 3)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium
              text-white/60 bg-white/[0.04] border border-white/[0.06]
              hover:bg-white/[0.08] hover:text-white/80
              transition-all duration-150 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium
              text-black bg-white hover:bg-white/90
              transition-all duration-150 disabled:opacity-60
              disabled:cursor-not-allowed min-w-[120px]"
          >
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Staff'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
