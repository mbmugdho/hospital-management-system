'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Phone, Globe, Clock, Save } from 'lucide-react'

export default function HospitalSettings() {
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: 'MediCore General Hospital',
    address: '123 Medical Center Drive, Suite 100, Boston, MA 02101',
    phone: '+1 (555) 000-1234',
    website: 'www.medicore-hospital.com',
    email: 'admin@medicore.com',
    timezone: 'EST (UTC-5)',
    beds: '240',
    founded: '2015',
  })

  const departments = [
    { name: 'Cardiology', head: 'Dr. Sarah Mitchell', staff: 12 },
    { name: 'Neurology', head: 'Dr. Robert Chen', staff: 8 },
    { name: 'Orthopedics', head: 'Dr. James Okafor', staff: 10 },
    { name: 'Pediatrics', head: 'Dr. Priya Nair', staff: 9 },
    { name: 'Emergency', head: 'Dr. Alan Foster', staff: 15 },
    { name: 'Radiology', head: 'Dr. Nina Patel', staff: 6 },
    { name: 'General Medicine', head: '—', staff: 14 },
  ]

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
          Manage your organization details and departments
        </p>
      </div>

      {/* Hospital info form */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-white font-medium text-sm">Organization Details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              key: 'name',
              label: 'Hospital Name',
              icon: Building2,
              type: 'text',
            },
            { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
            { key: 'email', label: 'Email', icon: Globe, type: 'email' },
            { key: 'website', label: 'Website', icon: Globe, type: 'text' },
            { key: 'timezone', label: 'Timezone', icon: Clock, type: 'text' },
            { key: 'beds', label: 'Total Beds', icon: Building2, type: 'text' },
          ].map((field) => {
            const Icon = field.icon
            return (
              <div key={field.key} className="space-y-2">
                <label
                  className="flex items-center gap-1.5 text-white/50
                  text-xs font-medium"
                >
                  <Icon className="w-3 h-3" />
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/[0.04]
                    border border-white/[0.08] rounded-xl text-white text-sm
                    placeholder:text-white/25 outline-none
                    focus:border-indigo-500/50 focus:bg-white/[0.06]
                    transition-all duration-200"
                />
              </div>
            )
          })}

          {/* Address — full width */}
          <div className="space-y-2 md:col-span-2">
            <label
              className="flex items-center gap-1.5 text-white/50
              text-xs font-medium"
            >
              <MapPin className="w-3 h-3" />
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-white/[0.04]
                border border-white/[0.08] rounded-xl text-white text-sm
                placeholder:text-white/25 outline-none
                focus:border-indigo-500/50 focus:bg-white/[0.06]
                transition-all duration-200 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <Building2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Departments</p>
              <p className="text-white/30 text-xs">
                {departments.length} active departments
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-3 py-1.5 text-xs text-indigo-400
              bg-indigo-500/10 border border-indigo-500/20 rounded-lg
              hover:bg-indigo-500/15 transition-colors"
          >
            + Add Department
          </motion.button>
        </div>

        {/* Department headers */}
        <div className="grid grid-cols-[1fr_1fr_60px] gap-4 px-4 mb-2">
          {['Department', 'Head', 'Staff'].map((h) => (
            <span key={h} className="text-white/30 text-xs font-medium">
              {h}
            </span>
          ))}
        </div>

        {/* Department rows */}
        <div className="space-y-1">
          {departments.map((dept) => (
            <motion.div
              key={dept.name}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="grid grid-cols-[1fr_1fr_60px] gap-4 items-center
                px-4 py-2.5 rounded-xl border border-transparent
                hover:border-white/[0.04] cursor-pointer transition-colors
                duration-150"
            >
              <p className="text-white/80 text-sm">{dept.name}</p>
              <p className="text-white/40 text-sm">{dept.head}</p>
              <span
                className="text-white/30 text-xs bg-white/[0.04]
                px-2 py-0.5 rounded-md text-center"
              >
                {dept.staff}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-emerald-400 text-xs"
          >
            ✓ Hospital settings saved
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
          Save Hospital Settings
        </motion.button>
      </div>
    </motion.div>
  )
}
