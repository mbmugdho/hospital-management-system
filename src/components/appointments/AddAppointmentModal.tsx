'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/shared/Modal'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Appointment } from '@/types'

interface AppointmentFormData {
  patient: string
  patientId: string
  doctor: string
  doctorId: string
  date: string
  time: string
  type: string
  status: string
  notes: string
}

const EMPTY_FORM: AppointmentFormData = {
  patient: '',
  patientId: '',
  doctor: '',
  doctorId: '',
  date: '',
  time: '',
  type: 'Consultation',
  status: 'Pending',
  notes: '',
}

const TYPE_OPTIONS = [
  'Consultation',
  'Follow-up',
  'Emergency',
  'Surgery',
  'Lab Test',
  'Vaccination',
  'Check-up',
]
const STATUS_OPTIONS = ['Confirmed', 'Pending', 'Completed', 'Cancelled']

// Time slots available for booking
const TIME_SLOTS = [
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
]

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AppointmentFormData) => Promise<void>
  editData?: WithMeta<Appointment> | null
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

export default function AddAppointmentModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isSaving,
}: AddAppointmentModalProps) {
  const [form, setForm] = useState<AppointmentFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({})

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        patient: editData.patient,
        patientId: editData.patientId,
        doctor: editData.doctor,
        doctorId: editData.doctorId,
        date: editData.date,
        time: editData.time,
        type: editData.type,
        status: editData.status,
        notes: editData.notes ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editData, isOpen])

  function set(field: keyof AppointmentFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const e: Partial<AppointmentFormData> = {}
    if (!form.patient.trim()) e.patient = 'Patient name is required'
    if (!form.doctor.trim()) e.doctor = 'Doctor name is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.time) e.time = 'Time is required'
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
      title={isEdit ? 'Edit Appointment' : 'New Appointment'}
      subtitle={
        isEdit
          ? editData?._isDummy
            ? 'Editing sample data — changes apply this session only'
            : 'Changes will be saved permanently'
          : 'Appointment will be saved to your records'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Patient name + Patient ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Label>Patient Name *</Label>
            <input
              className={inputClass}
              placeholder="James Thornton"
              value={form.patient}
              onChange={(e) => set('patient', e.target.value)}
            />
            {errors.patient && (
              <p className="text-red-400 text-xs mt-1">{errors.patient}</p>
            )}
          </div>
          <div>
            <Label>Patient ID</Label>
            <input
              className={inputClass}
              placeholder="PAT-001"
              value={form.patientId}
              onChange={(e) => set('patientId', e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Doctor name + Doctor ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Label>Doctor Name *</Label>
            <input
              className={inputClass}
              placeholder="Dr. Sarah Mitchell"
              value={form.doctor}
              onChange={(e) => set('doctor', e.target.value)}
            />
            {errors.doctor && (
              <p className="text-red-400 text-xs mt-1">{errors.doctor}</p>
            )}
          </div>
          <div>
            <Label>Doctor ID</Label>
            <input
              className={inputClass}
              placeholder="DOC-001"
              value={form.doctorId}
              onChange={(e) => set('doctorId', e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Date *</Label>
            <input
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <Label>Time *</Label>
            <select
              className={selectClass}
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
            >
              <option value="">Select time slot</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="text-red-400 text-xs mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Row 4: Type + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Appointment Type</Label>
            <select
              className={selectClass}
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
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

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Optional notes about this appointment..."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={3}
          />
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
              disabled:cursor-not-allowed min-w-[140px]"
          >
            {isSaving
              ? 'Saving...'
              : isEdit
                ? 'Save Changes'
                : 'Book Appointment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
