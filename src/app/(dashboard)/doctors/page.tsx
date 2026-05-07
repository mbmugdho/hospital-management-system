'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StaffStatBar from '@/components/staff/StaffStatBar'
import StaffFilters from '@/components/staff/StaffFilters'
import StaffGrid from '@/components/staff/StaffGrid'
import StaffTable from '@/components/staff/StaffTable'
import type {
  StaffRoleFilter,
  StaffStatusFilter,
  ViewMode,
} from '@/components/staff/StaffFilters'

export default function StaffPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<StaffRoleFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StaffStatusFilter>('All')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Staff"
          subtitle="Manage doctors, nurses, and all hospital staff"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search by name, role, department..."
          action={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 bg-white
                text-black rounded-xl text-sm font-medium
                hover:bg-white/90 transition-colors duration-200
                whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              Add Staff
            </motion.button>
          }
        />

        {/* Stats */}
        <StaffStatBar />

        {/* Filters + View Toggle */}
        <StaffFilters
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {/* Grid or Table */}

        {viewMode === 'grid' ? (
          <StaffGrid
            search={search}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
          />
        ) : (
          <StaffTable
            search={search}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
          />
        )}
      </div>
    </div>
  )
}
