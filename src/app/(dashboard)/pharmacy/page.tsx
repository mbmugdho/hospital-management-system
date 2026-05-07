'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import PharmacyStatBar from '@/components/pharmacy/PharmacyStatBar'
import PharmacyFilters from '@/components/pharmacy/PharmacyFilters'
import PharmacyTable from '@/components/pharmacy/PharmacyTable'
import type {
  StockFilter,
  CategoryFilter,
} from '@/components/pharmacy/PharmacyFilters'

export default function PharmacyPage() {
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<StockFilter>('All')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
        {/* Header */}
        <PageHeader
          title="Pharmacy"
          subtitle="Manage medicine inventory, stock levels, and suppliers"
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search medicine, category, supplier..."
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
              Add Medicine
            </motion.button>
          }
        />

        {/* Stats */}
        <PharmacyStatBar />

        {/* Filters */}
        <PharmacyFilters
          stockFilter={stockFilter}
          categoryFilter={categoryFilter}
          onStockChange={setStockFilter}
          onCategoryChange={setCategoryFilter}
        />

        {/* Table */}

        <PharmacyTable
          search={search}
          stockFilter={stockFilter}
          categoryFilter={categoryFilter}
        />
      </div>
    </div>
  )
}
