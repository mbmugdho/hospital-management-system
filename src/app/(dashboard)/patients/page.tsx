'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import PatientStatBar from '@/components/patients/PatientStatBar'
import PatientFilters from '@/components/patients/PatientFilters'
import PatientTable from '@/components/patients/PatientTable'
import type { FilterStatus } from '@/components/patients/PatientFilters'

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('All')

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Patients"
          subtitle="Manage and monitor all registered patients"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search patients, doctors, IDs..."
        />

        {/* Stat bar */}
        <PatientStatBar />

        {/* Filters */}
        <PatientFilters active={filter} onChange={setFilter} />

        {/* Table */}

        <PatientTable search={search} filter={filter} />
      </div>
    </div>
  )
}
