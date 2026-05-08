// Handles localStorage and sessionStorage for sample data visibility.
// hideSample: persists across refresh (localStorage)
// deletedDummyIds: persists across navigation but resets on refresh (sessionStorage)

const HIDE_SAMPLE_PREFIX = 'medicore_hide_sample_'
const DELETED_DUMMY_PREFIX = 'medicore_deleted_dummy_'

// Get the localStorage key for a specific page
function hideKey(page: string): string {
  return `${HIDE_SAMPLE_PREFIX}${page}`
}

// Get the sessionStorage key for deleted dummy IDs on a page
function deletedKey(page: string): string {
  return `${DELETED_DUMMY_PREFIX}${page}`
}

// Check if sample data is hidden for a page
export function getSampleHidden(page: string): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(hideKey(page)) === 'true'
}

// Set sample data visibility for a page
export function setSampleHidden(page: string, hidden: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(hideKey(page), String(hidden))
}

// Get list of dummy IDs deleted this session
export function getDeletedDummyIds(page: string): string[] {
  if (typeof window === 'undefined') return []
  const raw = sessionStorage.getItem(deletedKey(page))
  if (!raw) return []
  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

// Add a dummy ID to the deleted list for this session
export function addDeletedDummyId(page: string, id: string): void {
  if (typeof window === 'undefined') return
  const current = getDeletedDummyIds(page)
  if (!current.includes(id)) {
    sessionStorage.setItem(deletedKey(page), JSON.stringify([...current, id]))
  }
}

// Clear all deleted dummy IDs for a page (used by Clear Sample Data button)
export function clearDeletedDummyIds(page: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(deletedKey(page))
}
