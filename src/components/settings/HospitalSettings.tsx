'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Phone, Globe, Save, Loader2 } from 'lucide-react'
import { updateProfile } from '@/lib/supabase/queries/settings'
import type { useToast } from '@/components/shared/Toast'

interface HospitalSettingsProps {
  hospitalName?: string | null
  userAddress?: string | null
  toast: ReturnType<typeof useToast>['toast']
}

const inputClass = `
  w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white text-sm placeholder:text-white/25
  outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
`

export default function HospitalSettings({
  hospitalName,
  userAddress,
  toast,
}: HospitalSettingsProps) {
  const [form, setForm] = useState({
    name: hospitalName ?? '',
    address: userAddress ?? '',
    phone: '',
    website: '',
    email: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('Hospital name is required')
      return
    }
    setIsSaving(true)
    try {
      await updateProfile({
        hospital_name: form.name,
        address: form.address,
      })
      toast.success('Hospital settings saved successfully')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save hospital settings'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const fields = [
    {
      key: 'name',
      label: 'Hospital Name',
      icon: Building2,
      type: 'text',
      placeholder: 'MediCore General Hospital',
    },
    {
      key: 'phone',
      label: 'Phone',
      icon: Phone,
      type: 'tel',
      placeholder: '+1 (555) 000-1234',
    },
    {
      key: 'email',
      label: 'Email',
      icon: Globe,
      type: 'email',
      placeholder: 'admin@hospital.com',
    },
    {
      key: 'website',
      label: 'Website',
      icon: Globe,
      type: 'text',
      placeholder: 'www.hospital.com',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-white text-lg font-semibold">Hospital Settings</h2>
        <p className="text-white/40 text-sm mt-1">
          Manage your organization details
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-white font-medium text-sm">Organization Details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.key} className="space-y-2">
                <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                  <Icon className="w-3 h-3" /> {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className={inputClass}
                  placeholder={f.placeholder}
                />
              </div>
            )
          })}

          {/* Address — full width */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
              <MapPin className="w-3 h-3" /> Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200 resize-none"
              placeholder="123 Medical Center Drive, City, State ZIP"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-6 pt-5 border-t border-white/[0.06]">
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white
              text-black rounded-xl text-sm font-medium
              hover:bg-white/90 transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed min-w-[180px] justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Hospital Settings
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
