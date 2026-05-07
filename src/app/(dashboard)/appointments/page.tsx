'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import AppointmentStatBar from '@/components/appointments/AppointmentStatBar'
import AppointmentFilters from '@/components/appointments/AppointmentFilters'
import AppointmentTable from '@/components/appointments/AppointmentTable'
import type { AppointmentFilterStatus } from '@/components/appointments/AppointmentFilters'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AppointmentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<AppointmentFilterStatus>('All')
  const [dateFilter, setDateFilter] = useState('')

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Appointments"
          subtitle="Schedule and manage all patient appointments"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search patient, doctor, type..."
          action={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 bg-white
                text-black rounded-xl text-sm font-medium
                hover:bg-white/90 transition-colors duration-200
                whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </motion.button>
          }
        />

        {/* Stats */}
        <AppointmentStatBar />

        {/* Filters */}
        <AppointmentFilters
          active={filter}
          onChange={setFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
        />

        {/* Table */}
        <AppointmentTable
          search={search}
          filter={filter}
          dateFilter={dateFilter}
        />
      </div>
    </div>
  )
}
