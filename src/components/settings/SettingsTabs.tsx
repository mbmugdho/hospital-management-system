'use client'

import { motion } from 'framer-motion'
import { User, Shield, Bell, Palette, Building2 } from 'lucide-react'

export type SettingsTab =
  | 'profile'
  | 'security'
  | 'notifications'
  | 'appearance'
  | 'hospital'

interface SettingsTabsProps {
  active: SettingsTab
  onChange: (t: SettingsTab) => void
}

const tabs: {
  id: SettingsTab
  label: string
  icon: typeof User
  desc: string
}[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    desc: 'Personal info & avatar',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    desc: 'Password & 2FA',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    desc: 'Email, push & SMS',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    desc: 'Theme & layout',
  },
  {
    id: 'hospital',
    label: 'Hospital',
    icon: Building2,
    desc: 'Organization settings',
  },
]

export default function SettingsTabs({ active, onChange }: SettingsTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="w-full lg:w-64 flex-shrink-0"
    >
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active

          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3
                rounded-xl text-left transition-all duration-200
                ${
                  isActive
                    ? 'bg-white/[0.06] border border-white/[0.10] text-white'
                    : 'border border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0
                  ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400'
                      : 'bg-white/[0.04] text-white/30'
                  }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p
                  className={`text-sm font-medium
                  ${isActive ? 'text-white' : 'text-white/60'}`}
                >
                  {tab.label}
                </p>
                <p
                  className={`text-xs
                  ${isActive ? 'text-white/40' : 'text-white/25'}`}
                >
                  {tab.desc}
                </p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="settings-tab-indicator"
                  className="ml-auto w-1.5 h-8 bg-indigo-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>
    </motion.div>
  )
}
