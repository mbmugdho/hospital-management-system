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
import { exportToPDF } from '@/lib/utils/exportPDF'
import {
  clearDeletedDummyIds,
  setSampleHidden,
} from '@/lib/utils/sampleStorage'

import { patients as dummyPatients } from '@/data/patients'
import { appointments as dummyAppointments } from '@/data/appointments'
import { doctors as dummyDoctors } from '@/data/doctors'
import { invoices as dummyInvoices } from '@/data/billing'
import { medicines as dummyMedicines } from '@/data/pharmacy'

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

  async function handleExportAll() {
    setIsExporting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Fetch real data from Supabase in parallel
      const [
        { data: realPatients },
        { data: realAppointments },
        { data: realDoctors },
        { data: realInvoices },
        { data: realMedicines },
      ] = await Promise.all([
        supabase
          .from('patients')
          .select('*')
          .eq('user_id', user?.id ?? ''),
        supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user?.id ?? ''),
        supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user?.id ?? ''),
        supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user?.id ?? ''),
        supabase
          .from('medicines')
          .select('*')
          .eq('user_id', user?.id ?? ''),
      ])

      // Merge real + dummy data same as every other page
      const allPatients = [...(realPatients ?? []), ...dummyPatients]
      const allAppointments = [
        ...(realAppointments ?? []),
        ...dummyAppointments,
      ]
      const allDoctors = [...(realDoctors ?? []), ...dummyDoctors]
      const allInvoices = [...(realInvoices ?? []), ...dummyInvoices]
      const allMedicines = [...(realMedicines ?? []), ...dummyMedicines]

      // Revenue summary from invoices
      const totalRevenue = allInvoices.reduce(
        (s, inv) => s + (inv.total ?? 0),
        0
      )
      const paidRevenue = allInvoices
        .filter((i) => i.status === 'Paid')
        .reduce((s, i) => s + (i.total ?? 0), 0)
      const unpaidRevenue = allInvoices
        .filter((i) => i.status === 'Unpaid')
        .reduce((s, i) => s + (i.total ?? 0), 0)

      const generatedAt = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

      const hospitalName = 'MediCore Hospital'

      exportToPDF({
        hospitalName,
        reportTitle: 'Full Data Export Report',
        generatedAt,
        summary: [
          { label: 'Total Patients', value: String(allPatients.length) },
          {
            label: 'Total Appointments',
            value: String(allAppointments.length),
          },
          { label: 'Total Staff', value: String(allDoctors.length) },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
          { label: 'Paid', value: `$${paidRevenue.toFixed(2)}` },
          { label: 'Unpaid', value: `$${unpaidRevenue.toFixed(2)}` },
          { label: 'Medicines', value: String(allMedicines.length) },
        ],
        sections: [
          {
            title: 'Patients',
            headers: ['Name', 'Age', 'Gender', 'Blood', 'Status', 'Doctor'],
            rows: allPatients
              .slice(0, 30)
              .map((p) => [
                p.name ?? '',
                String(p.age ?? p.age ?? ''),
                p.gender ?? '',
                p.blood_group ?? p.bloodGroup ?? '',
                p.status ?? '',
                p.assigned_doctor ?? p.assignedDoctor ?? '',
              ]),
          },
          {
            title: 'Appointments',
            headers: ['Patient', 'Doctor', 'Date', 'Time', 'Type', 'Status'],
            rows: allAppointments
              .slice(0, 30)
              .map((a) => [
                a.patient_name ?? a.patient ?? '',
                a.doctor_name ?? a.doctor ?? '',
                a.date ?? '',
                a.time ?? '',
                a.type ?? '',
                a.status ?? '',
              ]),
          },
          {
            title: 'Doctors & Staff',
            headers: ['Name', 'Role', 'Department', 'Specialization', 'Status'],
            rows: allDoctors
              .slice(0, 30)
              .map((d) => [
                d.name ?? '',
                d.role ?? '',
                d.department ?? '',
                d.specialization ?? '',
                d.status ?? '',
              ]),
          },
          {
            title: 'Billing & Invoices',
            headers: ['Invoice ID', 'Patient', 'Date', 'Total', 'Status'],
            rows: allInvoices
              .slice(0, 30)
              .map((inv) => [
                inv.id ?? '',
                inv.patient_name ?? inv.patient ?? '',
                inv.date ?? '',
                `$${(inv.total ?? 0).toFixed(2)}`,
                inv.status ?? '',
              ]),
          },
          {
            title: 'Pharmacy & Medicines',
            headers: ['Name', 'Category', 'Stock', 'Unit', 'Price', 'Status'],
            rows: allMedicines
              .slice(0, 30)
              .map((m) => [
                m.name ?? '',
                m.category ?? '',
                String(m.stock ?? ''),
                m.unit ?? '',
                `$${(m.price ?? 0).toFixed(2)}`,
                m.stock_status ?? m.stockStatus ?? '',
              ]),
          },
        ],
      })

      toast.success('PDF report generated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  async function handleClearSample() {
    setIsClearing(true)
    await new Promise((r) => setTimeout(r, 400))
    PAGE_KEYS.forEach((key) => {
      clearDeletedDummyIds(key)
      setSampleHidden(key, true)
    })
    setIsClearing(false)
    toast.success('Sample data hidden across all pages')
  }

  async function handleDeleteAccount() {
    if (confirmText !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }
    setIsDeletingAcct(true)
    try {
      const supabase = createClient()
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
              Download a full PDF report of all your records
            </p>
          </div>
        </div>

        {/* What gets exported */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
          {[
            'Patients',
            'Appointments',
            'Doctors & Staff',
            'Invoices',
            'Medicines',
          ].map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-white/[0.02] border border-white/[0.04]"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="text-white/50 text-xs">{label}</span>
            </div>
          ))}
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
              <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export All Data as PDF
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
        <button
          onClick={() => setDangerOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4
            bg-red-500/5 hover:bg-red-500/[0.08] transition-colors duration-200"
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
                    This will permanently sign you out and remove your session.
                    All your data including patients, appointments, invoices,
                    and staff records will be deleted. This cannot be undone.
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
