'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { ToastContainer, useToast } from '@/components/shared/Toast'
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
  userPhone?: string | null
  userAddress?: string | null
  hospitalName?: string | null
}

export default function SettingsPageClient({
  userName,
  userEmail,
  userPhone,
  userAddress,
  hospitalName,
}: SettingsPageClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const { toasts, removeToast, toast } = useToast()

  return (
    <>
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
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
          <SettingsTabs active={activeTab} onChange={setActiveTab} />

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <ProfileSettings
                userName={userName}
                userEmail={userEmail}
                userPhone={userPhone}
                userAddress={userAddress}
                toast={toast}
              />
            )}
            {activeTab === 'security' && <SecuritySettings toast={toast} />}
            {activeTab === 'notifications' && (
              <NotificationSettings toast={toast} />
            )}
            {activeTab === 'appearance' && <AppearanceSettings toast={toast} />}
            {activeTab === 'hospital' && (
              <HospitalSettings
                hospitalName={hospitalName}
                userAddress={userAddress}
                toast={toast}
              />
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
