'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, Mail, Phone, MapPin, User } from 'lucide-react'

interface ProfileSettingsProps {
  userName?: string | null
  userEmail?: string | null
  hospitalName?: string | null
}

export default function ProfileSettings({
  userName,
  userEmail,
  hospitalName,
}: ProfileSettingsProps) {
  const [form, setForm] = useState({
    fullName: userName ?? '',
    email: userEmail ?? '',
    hospital: hospitalName ?? '',
    phone: '+1 (555) 000-0000',
    role: 'Administrator',
    address: '123 Medical Center Drive, Suite 100',
    bio: 'Hospital administrator managing daily operations and staff coordination.',
  })

  const [saved, setSaved] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      {/* Section title */}
      <div>
        <h2 className="text-white text-lg font-semibold">Profile Settings</h2>
        <p className="text-white/40 text-sm mt-1">
          Update your personal information and profile details
        </p>
      </div>

      {/* Avatar section */}
      <div
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl
        p-6 flex items-center gap-5"
      >
        <div className="relative group">
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
        <div>
          <p className="text-white font-medium">
            {form.fullName || 'Your Name'}
          </p>
          <p className="text-white/40 text-sm">{form.role}</p>
          <p className="text-white/25 text-xs mt-1">{form.hospital}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-1.5 text-white/50 text-xs
              font-medium"
            >
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-1.5 text-white/50 text-xs
              font-medium"
            >
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200"
              placeholder="you@email.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-1.5 text-white/50 text-xs
              font-medium"
            >
              <Phone className="w-3 h-3" /> Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Hospital */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-1.5 text-white/50 text-xs
              font-medium"
            >
              <MapPin className="w-3 h-3" /> Hospital Name
            </label>
            <input
              type="text"
              value={form.hospital}
              onChange={(e) => handleChange('hospital', e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200"
              placeholder="Hospital name"
            />
          </div>

          {/* Role — disabled */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">Role</label>
            <input
              type="text"
              value={form.role}
              disabled
              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.05]
                rounded-xl text-white/30 text-sm cursor-not-allowed"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-1.5 text-white/50 text-xs
              font-medium"
            >
              <MapPin className="w-3 h-3" /> Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200"
              placeholder="Your address"
            />
          </div>

          {/* Bio — full width */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-white/50 text-xs font-medium">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08]
                rounded-xl text-white text-sm placeholder:text-white/25
                outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Save button */}
        <div
          className="flex items-center justify-end gap-3 mt-6 pt-5
          border-t border-white/[0.06]"
        >
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-emerald-400 text-xs"
            >
              ✓ Changes saved
            </motion.span>
          )}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white
              text-black rounded-xl text-sm font-medium
              hover:bg-white/90 transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
