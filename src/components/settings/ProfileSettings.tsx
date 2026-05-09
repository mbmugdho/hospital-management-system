'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, Mail, Phone, MapPin, User, Loader2 } from 'lucide-react'
import { updateProfile } from '@/lib/supabase/queries/settings'
import type { useToast } from '@/components/shared/Toast'

interface ProfileSettingsProps {
  userName?: string | null
  userEmail?: string | null
  userPhone?: string | null
  userAddress?: string | null
  toast: ReturnType<typeof useToast>['toast']
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  )
}

const inputClass = `
  w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white text-sm placeholder:text-white/25
  outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
`

export default function ProfileSettings({
  userName,
  userEmail,
  userPhone,
  userAddress,
  toast,
}: ProfileSettingsProps) {
  const [form, setForm] = useState({
    fullName: userName ?? '',
    email: userEmail ?? '',
    phone: userPhone ?? '',
    address: userAddress ?? '',
  })
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.fullName.trim()) {
      toast.error('Full name is required')
      return
    }
    setIsSaving(true)
    try {
      await updateProfile({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
      })
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-white text-lg font-semibold">Profile Settings</h2>
        <p className="text-white/40 text-sm mt-1">
          Update your personal information
        </p>
      </div>

      {/* Avatar */}
      <div
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
        p-6 flex items-center gap-5"
      >
        <div className="relative group flex-shrink-0">
          <div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br
            from-indigo-500/30 to-violet-500/30 border border-white/[0.10]
            flex items-center justify-center"
          >
            <span className="text-white text-xl font-bold">
              {getInitials(form.fullName)}
            </span>
          </div>
          <button
            className="absolute inset-0 bg-black/50 rounded-2xl
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            flex items-center justify-center"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium truncate">
            {form.fullName || 'Your Name'}
          </p>
          <p className="text-white/40 text-sm">Administrator</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={inputClass}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClass}
              placeholder="you@email.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
              <Phone className="w-3 h-3" /> Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClass}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
              <MapPin className="w-3 h-3" /> Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={inputClass}
              placeholder="Your address"
            />
          </div>
        </div>

        {/* Save */}
        <div
          className="flex items-center justify-end gap-3 mt-6 pt-5
          border-t border-white/[0.06]"
        >
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white
              text-black rounded-xl text-sm font-medium
              hover:bg-white/90 transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]
              justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
