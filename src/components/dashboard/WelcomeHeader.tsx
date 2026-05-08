'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Bell, Download } from 'lucide-react'
import { exportToPDF } from '@/lib/utils/exportPDF'
import type { WithMeta } from '@/lib/utils/mergeData'
import type { Patient } from '@/types'
import type { Appointment } from '@/types'
import type { Invoice } from '@/types'
import type { Medicine } from '@/types'

interface WelcomeHeaderProps {
  userName?: string | null
  hospitalName?: string | null
  patients?: WithMeta<Patient>[]
  appointments?: WithMeta<Appointment>[]
  invoices?: WithMeta<Invoice>[]
  medicines?: WithMeta<Medicine>[]
}

export default function WelcomeHeader({
  userName,
  hospitalName,
  patients = [],
  appointments = [],
  invoices = [],
  medicines = [],
}: WelcomeHeaderProps) {
  const [greeting, setGreeting] = useState<string>('Hello')
  const [dateText, setDateText] = useState<string>('')
  const [genDate, setGenDate] = useState<string>('')

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    setGreeting(
      hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    )
    setDateText(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
    setGenDate(
      now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    )
  }, [])

  const displayName = userName ?? 'Doctor'
  const displayHospital = hospitalName ?? 'MediCore Hospital'

  // Total revenue from all merged invoices
  const totalRevenue = invoices.reduce((s, inv) => s + inv.total, 0)
  const paidRevenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((s, i) => s + i.total, 0)
  const unpaidRevenue = invoices
    .filter((i) => i.status === 'Unpaid')
    .reduce((s, i) => s + i.total, 0)

  function handleExportReport() {
    exportToPDF({
      hospitalName: displayHospital,
      reportTitle: 'Hospital Management Report',
      generatedAt: genDate,
      summary: [
        { label: 'Total Patients', value: patients.length.toString() },
        { label: 'Total Appointments', value: appointments.length.toString() },
        { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
        { label: 'Paid', value: `$${paidRevenue.toFixed(2)}` },
        { label: 'Unpaid', value: `$${unpaidRevenue.toFixed(2)}` },
        { label: 'Medicines', value: medicines.length.toString() },
      ],
      sections: [
        {
          title: 'Recent Patients',
          headers: ['Name', 'Age', 'Gender', 'Status', 'Doctor'],
          rows: patients
            .slice(0, 20)
            .map((p) => [
              p.name,
              String(p.age),
              p.gender,
              p.status,
              p.assignedDoctor,
            ]),
        },
        {
          title: 'Appointments',
          headers: ['Patient', 'Doctor', 'Date', 'Time', 'Type', 'Status'],
          rows: appointments
            .slice(0, 20)
            .map((a) => [
              a.patient,
              a.doctor,
              a.date,
              a.time,
              a.type,
              a.status,
            ]),
        },
        {
          title: 'Billing Summary',
          headers: ['Invoice', 'Patient', 'Date', 'Total', 'Status'],
          rows: invoices
            .slice(0, 20)
            .map((inv) => [
              inv.id,
              inv.patient,
              inv.date,
              `$${inv.total.toFixed(2)}`,
              inv.status,
            ]),
        },
        {
          title: 'Pharmacy Stock',
          headers: ['Medicine', 'Category', 'Stock', 'Unit', 'Price', 'Status'],
          rows: medicines
            .slice(0, 20)
            .map((m) => [
              m.name,
              m.category,
              String(m.stock),
              m.unit,
              `$${m.price.toFixed(2)}`,
              m.stockStatus,
            ]),
        },
      ],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </motion.div>
          <span className="text-white/40 text-sm">{greeting}</span>
        </div>

        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
          {displayName}
        </h1>

        <p className="text-white/40 text-sm mt-1">
          {displayHospital} &mdash; {dateText || '—'}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.04]
            border border-white/[0.08] rounded-xl text-white/60 text-sm
            hover:bg-white/[0.07] hover:text-white/90 transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Alerts</span>
          <span
            className="w-5 h-5 bg-indigo-500 rounded-full text-white
            text-xs flex items-center justify-center font-medium"
          >
            3
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black
            rounded-xl text-sm font-medium hover:bg-white/90
            transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
