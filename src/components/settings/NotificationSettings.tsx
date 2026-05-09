'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Bell,
  MessageSquare,
  Loader2,
  Calendar,
  AlertTriangle,
  UserPlus,
  DollarSign,
} from 'lucide-react'
import type { useToast } from '@/components/shared/Toast'

interface NotificationSettingsProps {
  toast: ReturnType<typeof useToast>['toast']
}

const STORAGE_KEY = 'medicore_notification_prefs'

interface Prefs {
  channels: { email: boolean; push: boolean; sms: boolean }
  alerts: {
    appointments: boolean
    emergencies: boolean
    newPatients: boolean
    billing: boolean
    stockAlerts: boolean
    staffChanges: boolean
  }
}

const DEFAULT_PREFS: Prefs = {
  channels: { email: true, push: true, sms: false },
  alerts: {
    appointments: true,
    emergencies: true,
    newPatients: true,
    billing: false,
    stockAlerts: true,
    staffChanges: false,
  },
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: () => void
}) {
  return (
    <motion.button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors
        duration-300 flex-shrink-0
        ${enabled ? 'bg-indigo-500' : 'bg-white/[0.08]'}`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </motion.button>
  )
}

export default function NotificationSettings({
  toast,
}: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [isSaving, setIsSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPrefs(JSON.parse(raw) as Prefs)
    } catch {}
    setLoaded(true)
  }, [])

  function toggleChannel(key: keyof Prefs['channels']) {
    setPrefs((p) => ({
      ...p,
      channels: { ...p.channels, [key]: !p.channels[key] },
    }))
  }

  function toggleAlert(key: keyof Prefs['alerts']) {
    setPrefs((p) => ({ ...p, alerts: { ...p.alerts, [key]: !p.alerts[key] } }))
  }

  async function handleSave() {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    setIsSaving(false)
    toast.success('Notification preferences saved')
  }

  const channelItems = [
    {
      key: 'email' as const,
      label: 'Email Notifications',
      desc: 'Receive updates via email',
      icon: Mail,
    },
    {
      key: 'push' as const,
      label: 'Push Notifications',
      desc: 'Browser and mobile push',
      icon: Bell,
    },
    {
      key: 'sms' as const,
      label: 'SMS Notifications',
      desc: 'Text message alerts',
      icon: MessageSquare,
    },
  ]

  const alertItems = [
    {
      key: 'appointments' as const,
      label: 'Appointment Reminders',
      desc: 'Upcoming appointments',
      icon: Calendar,
    },
    {
      key: 'emergencies' as const,
      label: 'Emergency Alerts',
      desc: 'Critical patient alerts',
      icon: AlertTriangle,
    },
    {
      key: 'newPatients' as const,
      label: 'New Patient Registration',
      desc: 'When a new patient is added',
      icon: UserPlus,
    },
    {
      key: 'billing' as const,
      label: 'Billing Updates',
      desc: 'Invoice and payment changes',
      icon: DollarSign,
    },
    {
      key: 'stockAlerts' as const,
      label: 'Low Stock Alerts',
      desc: 'Pharmacy inventory running low',
      icon: AlertTriangle,
    },
    {
      key: 'staffChanges' as const,
      label: 'Staff Schedule Changes',
      desc: 'When schedules are modified',
      icon: UserPlus,
    },
  ]

  if (!loaded) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-white text-lg font-semibold">
          Notification Settings
        </h2>
        <p className="text-white/40 text-sm mt-1">
          Choose how and when you want to be notified
        </p>
      </div>

      {/* Channels */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-white/60 text-xs font-medium mb-4 uppercase tracking-wider">
          Notification Channels
        </p>
        <div className="space-y-3">
          {channelItems.map((ch) => {
            const Icon = ch.icon
            return (
              <div
                key={ch.key}
                className="flex items-center justify-between px-4 py-3
                rounded-xl bg-white/[0.02] border border-white/[0.04]
                hover:border-white/[0.08] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white/[0.04] rounded-lg">
                    <Icon className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">{ch.label}</p>
                    <p className="text-white/30 text-xs">{ch.desc}</p>
                  </div>
                </div>
                <Toggle
                  enabled={prefs.channels[ch.key]}
                  onChange={() => toggleChannel(ch.key)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Alert types */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-white/60 text-xs font-medium mb-4 uppercase tracking-wider">
          Alert Types
        </p>
        <div className="space-y-3">
          {alertItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.key}
                className="flex items-center justify-between px-4 py-3
                rounded-xl bg-white/[0.02] border border-white/[0.04]
                hover:border-white/[0.08] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white/[0.04] rounded-lg">
                    <Icon className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">{item.label}</p>
                    <p className="text-white/30 text-xs">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  enabled={prefs.alerts[item.key]}
                  onChange={() => toggleAlert(item.key)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white
            text-black rounded-xl text-sm font-medium
            hover:bg-white/90 transition-colors duration-200
            disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px] justify-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
