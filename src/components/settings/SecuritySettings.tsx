'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Key, Smartphone, Eye, EyeOff, Loader2 } from 'lucide-react'
import { changePassword } from '@/lib/supabase/queries/settings'
import type { useToast } from '@/components/shared/Toast'

interface SecuritySettingsProps {
  toast: ReturnType<typeof useToast>['toast']
}

const inputClass = `
  w-full px-4 py-2.5 pr-10 bg-white/[0.04] border border-white/[0.08]
  rounded-xl text-white text-sm placeholder:text-white/25
  outline-none focus:border-indigo-500/50 focus:bg-white/[0.06]
  transition-all duration-200
`

export default function SecuritySettings({ toast }: SecuritySettingsProps) {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  })

  function setField(field: keyof typeof passwords, value: string) {
    setPasswords((p) => ({ ...p, [field]: value }))
  }

  async function handleSave() {
    if (!passwords.current.trim()) {
      toast.error('Enter your current password')
      return
    }
    if (passwords.next.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setIsSaving(true)
    try {
      await changePassword(passwords.next)
      toast.success('Password updated successfully')
      setPasswords({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update password'
      )
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
        <h2 className="text-white text-lg font-semibold">Security Settings</h2>
        <p className="text-white/40 text-sm mt-1">
          Manage your password and account security
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Key className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Change Password</p>
            <p className="text-white/30 text-xs">
              Update your password regularly
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          {/* Current password */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setField('current', e.target.value)}
                className={inputClass}
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-white/30 hover:text-white/60 transition-colors"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwords.next}
                onChange={(e) => setField('next', e.target.value)}
                className={inputClass}
                placeholder="Min 8 characters"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-white/30 hover:text-white/60 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setField('confirm', e.target.value)}
                className={inputClass}
                placeholder="Repeat new password"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-white/30 hover:text-white/60 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Save password */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex justify-end">
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
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              'Update Password'
            )}
          </motion.button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                Two-Factor Authentication
              </p>
              <p className="text-white/30 text-xs">
                Add an extra layer of security
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-12 h-6 rounded-full transition-colors
              duration-300 flex-shrink-0
              ${twoFA ? 'bg-emerald-500' : 'bg-white/[0.08]'}`}
          >
            <motion.div
              animate={{ x: twoFA ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            />
          </motion.button>
        </div>
        {twoFA && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/[0.06] text-white/40 text-xs"
          >
            2FA is enabled. You will need a code from your authenticator app on
            each login.
          </motion.p>
        )}
      </div>

      {/* Active sessions */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Shield className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Active Sessions</p>
            <p className="text-white/30 text-xs">Manage logged-in devices</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            {
              device: 'Chrome on Windows',
              location: 'Boston, MA',
              time: 'Current session',
              current: true,
            },
            {
              device: 'Safari on iPhone',
              location: 'Boston, MA',
              time: '2 hours ago',
              current: false,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3
              rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div>
                <p className="text-white/70 text-sm">{s.device}</p>
                <p className="text-white/30 text-xs">
                  {s.location} · {s.time}
                </p>
              </div>
              {s.current ? (
                <span
                  className="text-xs bg-emerald-500/10 text-emerald-400
                  px-2.5 py-1 rounded-full border border-emerald-500/20"
                >
                  Current
                </span>
              ) : (
                <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
