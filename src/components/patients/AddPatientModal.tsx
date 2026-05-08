'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/shared/Modal'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Patient } from '@/types'

// Form field shape — maps to both Patient type and Supabase columns
interface PatientFormData {
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
}

const EMPTY_FORM: PatientFormData = {
  name: '',
  age: '',
  gender: 'Male',
  bloodGroup: 'O+',
  phone: '',
  email: '',
  address: '',
  emergencyContact: '',
  assignedDoctor: '',
  status: 'Active',
}

// Dropdown options matching Supabase enums
const GENDER_OPTIONS = ['Male', 'Female', 'Other']
const BLOOD_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const STATUS_OPTIONS = ['Active', 'Admitted', 'Inactive']

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PatientFormData) => Promise<void>
  editData?: WithMeta<Patient> | null
  isSaving: boolean
}

// Reusable form field label
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-white/50 mb-1.5">
      {children}
    </label>
  )
}

// Reusable text input style
const inputClass = `
  w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white/80 text-sm placeholder:text-white/20
  outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
`

// Reusable select style
const selectClass = `
  w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white/80 text-sm outline-none
  focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
  [&>option]:bg-[#0A0A0A] [&>option]:text-white/80
`

export default function AddPatientModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isSaving,
}: AddPatientModalProps) {
  const [form, setForm] = useState<PatientFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<PatientFormData>>({})

  // Populate form when editing an existing patient
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        age: String(editData.age),
        gender: editData.gender,
        bloodGroup: editData.bloodGroup,
        phone: editData.phone,
        email: editData.email,
        address: editData.address,
        emergencyContact: editData.emergencyContact,
        assignedDoctor: editData.assignedDoctor,
        status: editData.status,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editData, isOpen])

  function set(field: keyof PatientFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Basic validation before save
  function validate(): boolean {
    const e: Partial<PatientFormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) <= 0)
      e.age = 'Valid age required'
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
      title={isEdit ? 'Edit Patient' : 'Add New Patient'}
      subtitle={
        isEdit
          ? editData?._isDummy
            ? 'Editing sample data — changes apply this session only'
            : 'Changes will be saved permanently'
          : 'Patient will be saved to your hospital records'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name + Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Label>Full Name *</Label>
            <input
              className={inputClass}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label>Age *</Label>
            <input
              type="number"
              className={inputClass}
              placeholder="35"
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              min={1}
              max={150}
            />
            {errors.age && (
              <p className="text-red-400 text-xs mt-1">{errors.age}</p>
            )}
          </div>
        </div>

        {/* Row 2: Gender + Blood Group + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Gender</Label>
            <select
              className={selectClass}
              value={form.gender}
              onChange={(e) => set('gender', e.target.value)}
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Blood Group</Label>
            <select
              className={selectClass}
              value={form.bloodGroup}
              onChange={(e) => set('bloodGroup', e.target.value)}
            >
              {BLOOD_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
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

        {/* Row 3: Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <Label>Email</Label>
            <input
              type="email"
              className={inputClass}
              placeholder="patient@email.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
        </div>

        {/* Row 4: Address */}
        <div>
          <Label>Address</Label>
          <input
            className={inputClass}
            placeholder="123 Main Street, City, State ZIP"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>

        {/* Row 5: Emergency Contact + Assigned Doctor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Emergency Contact</Label>
            <input
              className={inputClass}
              placeholder="+1 (555) 000-0001"
              value={form.emergencyContact}
              onChange={(e) => set('emergencyContact', e.target.value)}
            />
          </div>
          <div>
            <Label>Assigned Doctor</Label>
            <input
              className={inputClass}
              placeholder="Dr. Smith"
              value={form.assignedDoctor}
              onChange={(e) => set('assignedDoctor', e.target.value)}
            />
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
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Patient'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// Add and Edit patient modal form.
// In add mode: inserts to Supabase and appends to local state.
// In edit mode for real rows: updates Supabase and local state.
// In edit mode for dummy rows: updates local state only (session).
