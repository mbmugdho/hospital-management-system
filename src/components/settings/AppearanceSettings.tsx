'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Monitor, Moon, Sun, Check, Loader2 } from 'lucide-react'
import type { useToast } from '@/components/shared/Toast'

interface AppearanceSettingsProps {
  toast: ReturnType<typeof useToast>['toast']
}

const STORAGE_KEY = 'medicore_appearance_prefs'

interface AppearancePrefs {
  theme: 'dark' | 'light' | 'system'
  accent: string
  density: 'comfortable' | 'compact'
}

const DEFAULT_PREFS: AppearancePrefs = {
  theme: 'dark',
  accent: 'indigo',
  density: 'comfortable',
}

const accentColors = [
  { name: 'indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500/30' },
  { name: 'violet', bg: 'bg-violet-500', ring: 'ring-violet-500/30' },
  { name: 'sky', bg: 'bg-sky-500', ring: 'ring-sky-500/30' },
  { name: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  { name: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500/30' },
  { name: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500/30' },
]

const themes = [
  {
    id: 'dark' as const,
    label: 'Dark',
    desc: 'Dark cosmic theme',
    icon: Moon,
    preview: 'bg-[#0A0A0A]',
  },
  {
    id: 'light' as const,
    label: 'Light',
    desc: 'Light clean theme',
    icon: Sun,
    preview: 'bg-gray-100',
  },
  {
    id: 'system' as const,
    label: 'System',
    desc: 'Match OS preference',
    icon: Monitor,
    preview: 'bg-gradient-to-br from-[#0A0A0A] to-gray-100',
  },
]

export default function AppearanceSettings({ toast }: AppearanceSettingsProps) {
  const [prefs, setPrefs] = useState<AppearancePrefs>(DEFAULT_PREFS)
  const [isSaving, setIsSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPrefs(JSON.parse(raw) as AppearancePrefs)
    } catch {}
    setLoaded(true)
  }, [])

  function set<K extends keyof AppearancePrefs>(
    key: K,
    value: AppearancePrefs[K]
  ) {
    setPrefs((p) => ({ ...p, [key]: value }))
  }

  async function handleSave() {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    setIsSaving(false)
    toast.success('Appearance preferences saved')
  }

  if (!loaded) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-white text-lg font-semibold">Appearance</h2>
        <p className="text-white/40 text-sm mt-1">
          Customize the look and feel of your dashboard
        </p>
      </div>

      {/* Theme */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Palette className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Theme</p>
            <p className="text-white/30 text-xs">
              Select your preferred color scheme
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon
            const isActive = prefs.theme === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => set('theme', t.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border text-left
                  transition-all duration-200
                  ${
                    isActive
                      ? 'border-indigo-500/40 bg-indigo-500/5'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]'
                  }`}
              >
                <div
                  className={`w-full h-16 rounded-lg mb-3 ${t.preview}
                  border border-white/[0.08]`}
                />
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/30'}`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}
                    >
                      {t.label}
                    </p>
                    <p className="text-white/30 text-xs">{t.desc}</p>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 bg-indigo-500
                      rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Accent */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-white/60 text-xs font-medium mb-4 uppercase tracking-wider">
          Accent Color
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {accentColors.map((c) => {
            const isActive = prefs.accent === c.name
            return (
              <motion.button
                key={c.name}
                onClick={() => set('accent', c.name)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full ${c.bg}
                  flex items-center justify-center transition-all duration-200
                  ${isActive ? `ring-2 ring-offset-2 ring-offset-[#0A0A0A] ${c.ring}` : ''}`}
              >
                {isActive && <Check className="w-3.5 h-3.5 text-white" />}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Density */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-white/60 text-xs font-medium mb-4 uppercase tracking-wider">
          Layout Density
        </p>
        <div className="flex items-center gap-3">
          {(['comfortable', 'compact'] as const).map((d) => {
            const isActive = prefs.density === d
            return (
              <motion.button
                key={d}
                onClick={() => set('density', d)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2 rounded-xl text-sm font-medium border
                  capitalize transition-all duration-200
                  ${
                    isActive
                      ? 'bg-white/[0.08] text-white border-white/[0.12]'
                      : 'border-white/[0.06] text-white/40 hover:text-white/70'
                  }`}
              >
                {d}
              </motion.button>
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
            'Save Appearance'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
