'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Trash2,
  AlertTriangle,
  Shield,
  Database,
  FileText,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { exportToCSV } from '@/lib/utils/exportCSV'
import {
  clearDeletedDummyIds,
  setSampleHidden,
} from '@/lib/utils/sampleStorage'
import type { useToast } from '@/components/shared/Toast'

interface PrivacySettingsProps {
  toast: ReturnType<typeof useToast>['toast']
}

const PAGE_KEYS = ['patients', 'appointments', 'doctors', 'billing', 'pharmacy']

export default function PrivacySettings({ toast }: PrivacySettingsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isDeletingAcct, setIsDeletingAcct] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [dangerOpen, setDangerOpen] = useState(false)

  // Export all real data from Supabase as CSV files
  async function handleExportAll() {
    setIsExporting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch all tables in parallel
      const [patients, appointments, doctors, invoices, medicines] =
        await Promise.all([
          supabase.from('patients').select('*').eq('user_id', user.id),
          supabase.from('appointments').select('*').eq('user_id', user.id),
          supabase.from('doctors').select('*').eq('user_id', user.id),
          supabase.from('invoices').select('*').eq('user_id', user.id),
          supabase.from('medicines').select('*').eq('user_id', user.id),
        ])

      // Download each as separate CSV with a small delay between them
      if (patients.data?.length) {
        exportToCSV(patients.data, 'medicore_patients')
        await delay(300)
      }
      if (appointments.data?.length) {
        exportToCSV(appointments.data, 'medicore_appointments')
        await delay(300)
      }
      if (doctors.data?.length) {
        exportToCSV(doctors.data, 'medicore_staff')
        await delay(300)
      }
      if (invoices.data?.length) {
        exportToCSV(invoices.data, 'medicore_invoices')
        await delay(300)
      }
      if (medicines.data?.length) {
        exportToCSV(medicines.data, 'medicore_medicines')
      }

      toast.success('All data exported successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  // Clear all sample data across all pages from localStorage
  async function handleClearSample() {
    setIsClearing(true)
    await delay(400)
    PAGE_KEYS.forEach((key) => {
      clearDeletedDummyIds(key)
      setSampleHidden(key, true)
    })
    setIsClearing(false)
    toast.success(
      'Sample data hidden across all pages — refresh any page to confirm'
    )
  }

  // Delete account via Supabase
  async function handleDeleteAccount() {
    if (confirmText !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }
    setIsDeletingAcct(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch {
      toast.error('Account deletion failed — contact support')
    } finally {
      setIsDeletingAcct(false)
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
        <h2 className="text-white text-lg font-semibold">Data & Privacy</h2>
        <p className="text-white/40 text-sm mt-1">
          Manage your data, exports, and account
        </p>
      </div>

      {/* Export section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Export Your Data</p>
            <p className="text-white/30 text-xs">
              Download all your records as CSV files
            </p>
          </div>
        </div>

        {/* What gets exported */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Patients', icon: FileText },
            { label: 'Appointments', icon: FileText },
            { label: 'Staff', icon: FileText },
            { label: 'Invoices', icon: FileText },
            { label: 'Medicines', icon: FileText },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl
                  bg-white/[0.02] border border-white/[0.04]"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="text-white/50 text-xs">{item.label}</span>
              </div>
            )
          })}
        </div>

        <motion.button
          onClick={handleExportAll}
          disabled={isExporting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5
            bg-indigo-500/10 border border-indigo-500/20 rounded-xl
            text-indigo-400 text-sm font-medium
            hover:bg-indigo-500/15 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export All Data
            </>
          )}
        </motion.button>
      </div>

      {/* Sample data section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Sample Data</p>
            <p className="text-white/30 text-xs">
              Hide demo data across all pages at once
            </p>
          </div>
        </div>

        <p className="text-white/30 text-xs mb-4 leading-relaxed">
          Sample data is shown by default to demonstrate the system. Hiding it
          here applies to all pages simultaneously. It resets on browser refresh
          — this is by design.
        </p>

        <motion.button
          onClick={handleClearSample}
          disabled={isClearing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5
            bg-amber-500/10 border border-amber-500/20 rounded-xl
            text-amber-400 text-sm font-medium
            hover:bg-amber-500/15 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Clearing...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" /> Hide All Sample Data
            </>
          )}
        </motion.button>
      </div>

      {/* Danger zone */}
      <div className="border border-red-500/20 rounded-2xl overflow-hidden">
        {/* Collapsible header */}
        <button
          onClick={() => setDangerOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4
            bg-red-500/5 hover:bg-red-500/8 transition-colors duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-red-400 font-medium text-sm">Danger Zone</p>
              <p className="text-red-400/50 text-xs">Irreversible actions</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: dangerOpen ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChevronDown className="w-4 h-4 text-red-400/60" />
          </motion.div>
        </button>

        {/* Collapsible content */}
        <AnimatePresence>
          {dangerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-5 space-y-4 border-t border-red-500/10">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">
                    Delete Account
                  </p>
                  <p className="text-white/30 text-xs leading-relaxed">
                    This will permanently delete your account and all associated
                    data including patients, appointments, invoices, and staff
                    records. This action cannot be undone.
                  </p>
                </div>

                {!deleteConfirm ? (
                  <motion.button
                    onClick={() => setDeleteConfirm(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5
                      bg-red-500/10 border border-red-500/20 rounded-xl
                      text-red-400 text-sm font-medium
                      hover:bg-red-500/15 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete My Account
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-red-400/70 text-xs">
                      Type{' '}
                      <span className="font-mono font-bold text-red-400">
                        DELETE
                      </span>{' '}
                      to confirm
                    </p>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full max-w-xs px-4 py-2.5
                        bg-red-500/5 border border-red-500/20 rounded-xl
                        text-red-400 text-sm placeholder:text-red-400/20
                        outline-none focus:border-red-500/40
                        transition-all duration-200 font-mono"
                    />
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAcct || confirmText !== 'DELETE'}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-2.5
                          bg-red-500 rounded-xl text-white text-sm font-medium
                          hover:bg-red-600 transition-all duration-200
                          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isDeletingAcct ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{' '}
                            Deleting...
                          </>
                        ) : (
                          'Confirm Delete'
                        )}
                      </motion.button>
                      <button
                        onClick={() => {
                          setDeleteConfirm(false)
                          setConfirmText('')
                        }}
                        className="text-white/30 text-sm hover:text-white/60
                          transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
