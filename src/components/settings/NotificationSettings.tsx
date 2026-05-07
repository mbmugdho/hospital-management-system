'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Bell,
  MessageSquare,
  Save,
  Calendar,
  AlertTriangle,
  UserPlus,
  DollarSign,
} from 'lucide-react'

interface ToggleProps {
  enabled: boolean
  onChange: () => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
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

export default function NotificationSettings() {
  const [saved, setSaved] = useState(false)

  const [channels, setChannels] = useState({
    email: true,
    push: true,
    sms: false,
  })

  const [alerts, setAlerts] = useState({
    appointments: true,
    emergencies: true,
    newPatients: true,
    billing: false,
    stockAlerts: true,
    staffChanges: false,
  })

  function toggleChannel(key: keyof typeof channels) {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  function toggleAlert(key: keyof typeof alerts) {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const alertItems: {
    key: keyof typeof alerts
    label: string
    desc: string
    icon: typeof Bell
  }[] = [
    {
      key: 'appointments',
      label: 'Appointment Reminders',
      desc: 'Get notified about upcoming appointments',
      icon: Calendar,
    },
    {
      key: 'emergencies',
      label: 'Emergency Alerts',
      desc: 'Critical patient alerts and emergencies',
      icon: AlertTriangle,
    },
    {
      key: 'newPatients',
      label: 'New Patient Registration',
      desc: 'When a new patient is registered',
      icon: UserPlus,
    },
    {
      key: 'billing',
      label: 'Billing Updates',
      desc: 'Invoice payments and billing changes',
      icon: DollarSign,
    },
    {
      key: 'stockAlerts',
      label: 'Low Stock Alerts',
      desc: 'Pharmacy inventory running low',
      icon: AlertTriangle,
    },
    {
      key: 'staffChanges',
      label: 'Staff Schedule Changes',
      desc: 'When staff schedules are modified',
      icon: UserPlus,
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
        <h2 className="text-white text-lg font-semibold">
          Notification Settings
        </h2>
        <p className="text-white/40 text-sm mt-1">
          Choose how and when you want to be notified
        </p>
      </div>

      {/* Channels */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p
          className="text-white/60 text-xs font-medium mb-4 uppercase
          tracking-wider"
        >
          Notification Channels
        </p>
        <div className="space-y-3">
          {[
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
          ].map((ch) => {
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
                  enabled={channels[ch.key]}
                  onChange={() => toggleChannel(ch.key)}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Alert types */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p
          className="text-white/60 text-xs font-medium mb-4 uppercase
          tracking-wider"
        >
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
                  enabled={alerts[item.key]}
                  onChange={() => toggleAlert(item.key)}
                />
              </div>
            )
          })}
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
            ✓ Preferences saved
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
          Save Preferences
        </motion.button>
      </div>
    </motion.div>
  )
}
