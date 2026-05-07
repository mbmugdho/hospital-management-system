'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import SettingsTabs from '@/components/settings/SettingsTabs'
import ProfileSettings from '@/components/settings/ProfileSettings'
import SecuritySettings from '@/components/settings/SecuritySettings'
import NotificationSettings from '@/components/settings/NotificationSettings'
import AppearanceSettings from '@/components/settings/AppearanceSettings'
import HospitalSettings from '@/components/settings/HospitalSettings'
import type { SettingsTab } from '@/components/settings/SettingsTabs'

interface SettingsPageClientProps {
  userName?: string | null
  userEmail?: string | null
  hospitalName?: string | null
}

export default function SettingsPageClient({
  userName,
  userEmail,
  hospitalName,
}: SettingsPageClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1
                className="text-white text-2xl sm:text-3xl font-bold
                tracking-tight"
              >
                Settings
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                Manage your account and application preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* Layout: tabs + content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <SettingsTabs active={activeTab} onChange={setActiveTab} />

          {/* Content area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <ProfileSettings
                userName={userName}
                userEmail={userEmail}
                hospitalName={hospitalName}
              />
            )}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'hospital' && <HospitalSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}
