'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import BillingStatBar from '@/components/billing/BillingStatBar'
import BillingFilters from '@/components/billing/BillingFilters'
import BillingTable from '@/components/billing/BillingTable'
import type { BillingFilterStatus } from '@/components/billing/BillingFilters'

export default function BillingPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<BillingFilterStatus>('All')

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Billing"
          subtitle="Manage invoices, payments, and revenue tracking"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search invoice, patient..."
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
              New Invoice
            </motion.button>
          }
        />

        {/* Stats */}
        <BillingStatBar />

        {/* Filters */}
        <BillingFilters active={filter} onChange={setFilter} />

        {/* Table */}
        <BillingTable search={search} filter={filter} />
      </div>
    </div>
  )
}
