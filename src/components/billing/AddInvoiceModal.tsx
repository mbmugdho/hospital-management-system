'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '@/components/shared/Modal'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Invoice } from '@/types'

interface LineItem {
  description: string
  quantity: number
  price: number
}

interface InvoiceFormData {
  patient: string
  patientId: string
  date: string
  status: string
  notes: string
  items: LineItem[]
}

const STATUS_OPTIONS = ['Paid', 'Unpaid', 'Partial']

const TAX_RATE = 0.1

function emptyItem(): LineItem {
  return { description: '', quantity: 1, price: 0 }
}

const EMPTY_FORM: InvoiceFormData = {
  patient: '',
  patientId: '',
  date: '',
  status: 'Unpaid',
  notes: '',
  items: [emptyItem()],
}

interface AddInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (
    data: InvoiceFormData,
    subtotal: number,
    tax: number,
    total: number
  ) => Promise<void>
  editData?: WithMeta<Invoice> | null
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

export default function AddInvoiceModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isSaving,
}: AddInvoiceModalProps) {
  const [form, setForm] = useState<InvoiceFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    if (editData) {
      setForm({
        patient: editData.patient,
        patientId: editData.patientId,
        date: editData.date,
        status: editData.status,
        notes: editData.notes ?? '',
        items: editData.items.map((it) => ({
          description: it.description,
          quantity: it.quantity,
          price: it.price,
        })),
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editData, isOpen])

  function setField(field: keyof InvoiceFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function setItem(idx: number, field: keyof LineItem, value: string) {
    setForm((prev) => {
      const items = [...prev.items]
      items[idx] = {
        ...items[idx]!,
        [field]: field === 'description' ? value : Number(value),
      }
      return { ...prev, items }
    })
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }))
  }

  function removeItem(idx: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }))
  }

  // Compute totals live from items
  const subtotal = form.items.reduce((s, it) => s + it.quantity * it.price, 0)
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total = parseFloat((subtotal + tax).toFixed(2))

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.patient.trim()) e.patient = 'Patient name is required'
    if (!form.date) e.date = 'Date is required'
    if (form.items.length === 0) e.items = 'At least one item is required'
    form.items.forEach((it, i) => {
      if (!it.description.trim()) e[`item_${i}`] = 'Description required'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave(form, subtotal, tax, total)
  }

  const isEdit = !!editData

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Invoice' : 'New Invoice'}
      subtitle={
        isEdit
          ? editData?._isDummy
            ? 'Editing sample data — changes apply this session only'
            : 'Changes will be saved permanently'
          : 'Invoice will be saved to billing records'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient + ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Label>Patient Name *</Label>
            <input
              className={inputClass}
              placeholder="James Thornton"
              value={form.patient}
              onChange={(e) => setField('patient', e.target.value)}
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
              onChange={(e) => setField('patientId', e.target.value)}
            />
          </div>
        </div>

        {/* Date + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Invoice Date *</Label>
            <input
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <Label>Status</Label>
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Line items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Line Items *</Label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs text-indigo-400
                hover:text-indigo-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          {/* Item column headers */}
          <div className="grid grid-cols-[1fr_56px_80px_32px] gap-2 px-1 mb-1">
            {['Description', 'Qty', 'Price', ''].map((h, i) => (
              <span key={i} className="text-white/25 text-xs">
                {h}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {form.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_56px_80px_32px] gap-2"
              >
                <input
                  className={inputClass}
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) => setItem(idx, 'description', e.target.value)}
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="1"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => setItem(idx, 'quantity', e.target.value)}
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  value={item.price}
                  onChange={(e) => setItem(idx, 'price', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={form.items.length === 1}
                  className="p-2 rounded-xl text-white/20 hover:text-red-400
                    hover:bg-red-500/10 transition-all duration-150
                    disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {errors.items && (
            <p className="text-red-400 text-xs mt-1">{errors.items}</p>
          )}
        </div>

        {/* Live totals preview */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">Subtotal</span>
            <span className="text-white/60 text-sm font-medium">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">Tax (10%)</span>
            <span className="text-white/60 text-sm font-medium">
              ${tax.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
            <span className="text-white/70 text-sm font-semibold">Total</span>
            <span className="text-white text-base font-bold">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Optional payment notes..."
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={2}
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
              disabled:cursor-not-allowed min-w-[130px]"
          >
            {isSaving
              ? 'Saving...'
              : isEdit
                ? 'Save Changes'
                : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
