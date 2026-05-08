'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/shared/Modal'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Medicine } from '@/types'

interface MedicineFormData {
  name: string
  category: string
  stock: string
  unit: string
  price: string
  expiryDate: string
  supplier: string
  stockStatus: string
}

const EMPTY_FORM: MedicineFormData = {
  name: '',
  category: 'Antibiotics',
  stock: '',
  unit: 'Tablets',
  price: '',
  expiryDate: '',
  supplier: '',
  stockStatus: 'High',
}

const CATEGORY_OPTIONS = [
  'Antibiotics',
  'Painkillers',
  'Cardiac',
  'Diabetes',
  'Respiratory',
  'Vitamins',
  'Antiseptics',
  'Hormones',
  'Antidepressants',
  'Antivirals',
  'Antibiotic',
  'Antidiabetic',
  'Antihypertensive',
  'Analgesic',
  'Anti-inflammatory',
  'Antacid',
  'Statin',
  'Antihistamine',
  'Bronchodilator',
  'Opioid Analgesic',
  'Supplement',
  'IV Fluid',
  'Sedative',
]

const UNIT_OPTIONS = [
  'Tablets',
  'Tablet',
  'Capsule',
  'Capsules',
  'Syrup',
  'Injection',
  'Vial',
  'Ampule',
  'Inhaler',
  'Bag',
  'Patch',
]

const STOCK_STATUS_OPTIONS = ['High', 'Medium', 'Low']

interface AddMedicineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: MedicineFormData) => Promise<void>
  editData?: WithMeta<Medicine> | null
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

export default function AddMedicineModal({
  isOpen,
  onClose,
  onSave,
  editData,
  isSaving,
}: AddMedicineModalProps) {
  const [form, setForm] = useState<MedicineFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<MedicineFormData>>({})

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        category: editData.category,
        stock: String(editData.stock),
        unit: editData.unit,
        price: String(editData.price),
        expiryDate: editData.expiryDate,
        supplier: editData.supplier,
        stockStatus: editData.stockStatus,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editData, isOpen])

  function set(field: keyof MedicineFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const e: Partial<MedicineFormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.stock || isNaN(Number(form.stock)))
      e.stock = 'Valid stock quantity required'
    if (!form.price || isNaN(Number(form.price)))
      e.price = 'Valid price required'
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required'
    if (!form.supplier.trim()) e.supplier = 'Supplier is required'
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
      title={isEdit ? 'Edit Medicine' : 'Add New Medicine'}
      subtitle={
        isEdit
          ? editData?._isDummy
            ? 'Editing sample data — changes apply this session only'
            : 'Changes will be saved permanently'
          : 'Medicine will be added to pharmacy inventory'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <Label>Medicine Name *</Label>
          <input
            className={inputClass}
            placeholder="Amoxicillin 500mg"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category + Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <select
              className={selectClass}
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Unit</Label>
            <select
              className={selectClass}
              value={form.unit}
              onChange={(e) => set('unit', e.target.value)}
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Stock Quantity *</Label>
            <input
              type="number"
              className={inputClass}
              placeholder="500"
              min={0}
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
            />
            {errors.stock && (
              <p className="text-red-400 text-xs mt-1">{errors.stock}</p>
            )}
          </div>
          <div>
            <Label>Unit Price ($) *</Label>
            <input
              type="number"
              className={inputClass}
              placeholder="0.85"
              min={0}
              step={0.01}
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
            />
            {errors.price && (
              <p className="text-red-400 text-xs mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        {/* Expiry Date + Stock Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Expiry Date *</Label>
            <input
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              value={form.expiryDate}
              onChange={(e) => set('expiryDate', e.target.value)}
            />
            {errors.expiryDate && (
              <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>
            )}
          </div>
          <div>
            <Label>Stock Status</Label>
            <select
              className={selectClass}
              value={form.stockStatus}
              onChange={(e) => set('stockStatus', e.target.value)}
            >
              {STOCK_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Supplier */}
        <div>
          <Label>Supplier *</Label>
          <input
            className={inputClass}
            placeholder="PharmaCorp Ltd"
            value={form.supplier}
            onChange={(e) => set('supplier', e.target.value)}
          />
          {errors.supplier && (
            <p className="text-red-400 text-xs mt-1">{errors.supplier}</p>
          )}
        </div>

        {/* Live inventory value preview */}
        {form.stock && form.price && (
          <div
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3
            flex items-center justify-between"
          >
            <span className="text-white/40 text-xs">
              Estimated Inventory Value
            </span>
            <span className="text-indigo-400 text-sm font-semibold">
              $
              {(Number(form.stock) * Number(form.price)).toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                }
              )}
            </span>
          </div>
        )}

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
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Medicine'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
