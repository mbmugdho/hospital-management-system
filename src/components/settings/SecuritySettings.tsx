'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Key, Smartphone, Eye, EyeOff, Save } from 'lucide-react'

export default function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [saved, setSaved] = useState(false)

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

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
          {/* Current */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, current: e.target.value }))
                }
                className="w-full px-4 py-2.5 pr-10 bg-white/[0.04]
                  border border-white/[0.08] rounded-xl text-white text-sm
                  placeholder:text-white/25 outline-none
                  focus:border-indigo-500/50 focus:bg-white/[0.06]
                  transition-all duration-200"
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

          {/* New */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, new: e.target.value }))
                }
                className="w-full px-4 py-2.5 pr-10 bg-white/[0.04]
                  border border-white/[0.08] rounded-xl text-white text-sm
                  placeholder:text-white/25 outline-none
                  focus:border-indigo-500/50 focus:bg-white/[0.06]
                  transition-all duration-200"
                placeholder="Enter new password"
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

          {/* Confirm */}
          <div className="space-y-2">
            <label className="text-white/50 text-xs font-medium">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, confirm: e.target.value }))
                }
                className="w-full px-4 py-2.5 pr-10 bg-white/[0.04]
                  border border-white/[0.08] rounded-xl text-white text-sm
                  placeholder:text-white/25 outline-none
                  focus:border-indigo-500/50 focus:bg-white/[0.06]
                  transition-all duration-200"
                placeholder="Confirm new password"
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
      </div>

      {/* Two-Factor Authentication */}
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
                Add an extra layer of security to your account
              </p>
            </div>
          </div>

          {/* Toggle */}
          <motion.button
            onClick={() => setTwoFA(!twoFA)}
            className={`relative w-12 h-6 rounded-full transition-colors
              duration-300 ${twoFA ? 'bg-emerald-500' : 'bg-white/[0.08]'}`}
          >
            <motion.div
              animate={{ x: twoFA ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            />
          </motion.button>
        </div>

        {twoFA && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-white/[0.06]"
          >
            <p className="text-white/40 text-xs">
              2FA is enabled. You&apos;ll need to enter a code from your
              authenticator app each time you log in.
            </p>
          </motion.div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Shield className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Active Sessions</p>
            <p className="text-white/30 text-xs">
              Manage your logged-in devices
            </p>
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
          ].map((session, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3
                rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div>
                <p className="text-white/70 text-sm">{session.device}</p>
                <p className="text-white/30 text-xs">
                  {session.location} · {session.time}
                </p>
              </div>
              {session.current ? (
                <span
                  className="text-xs bg-emerald-500/10 text-emerald-400
                  px-2.5 py-1 rounded-full border border-emerald-500/20"
                >
                  Current
                </span>
              ) : (
                <button
                  className="text-xs text-red-400 hover:text-red-300
                  transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
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
            ✓ Security settings updated
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
          Update Security
        </motion.button>
      </div>
    </motion.div>
  )
}
