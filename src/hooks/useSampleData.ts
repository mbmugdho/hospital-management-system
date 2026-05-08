// Central hook for managing sample data visibility and deletion state.
// Used by every page that has dummy data.

'use client'

import { useState, useEffect } from 'react'
import {
  getSampleHidden,
  setSampleHidden,
  getDeletedDummyIds,
  addDeletedDummyId,
  clearDeletedDummyIds,
} from '@/lib/utils/sampleStorage'

interface UseSampleDataReturn {
  hideSample: boolean
  deletedDummyIds: string[]
  toggleHideSample: () => void
  deleteDummyRow: (id: string) => void
  clearSampleData: () => void
  restoreSampleData: () => void
  isMounted: boolean
}

export function useSampleData(page: string): UseSampleDataReturn {
  const [hideSample, setHideSample] = useState(false)
  const [deletedDummyIds, setDeletedDummyIds] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load from storage after mount to avoid hydration mismatch
  useEffect(() => {
    setHideSample(getSampleHidden(page))
    setDeletedDummyIds(getDeletedDummyIds(page))
    setIsMounted(true)
  }, [page])

  // Toggle hide/show all sample data
  function toggleHideSample(): void {
    const next = !hideSample
    setHideSample(next)
    setSampleHidden(page, next)
  }

  // Mark a single dummy row as deleted for this session
  function deleteDummyRow(id: string): void {
    addDeletedDummyId(page, id)
    setDeletedDummyIds((prev) => [...prev, id])
  }

  // Clear all dummy rows from view (session only)
  function clearSampleData(): void {
    clearDeletedDummyIds(page)
    setDeletedDummyIds([])
    setSampleHidden(page, true)
    setHideSample(true)
  }

  // Restore all sample data (re-show everything)
  function restoreSampleData(): void {
    clearDeletedDummyIds(page)
    setDeletedDummyIds([])
    setSampleHidden(page, false)
    setHideSample(false)
  }

  return {
    hideSample,
    deletedDummyIds,
    toggleHideSample,
    deleteDummyRow,
    clearSampleData,
    restoreSampleData,
    isMounted,
  }
}
