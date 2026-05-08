// Converts an array of objects to a CSV file and triggers browser download.
// Strips internal metadata fields (_isDummy, _localId) before export.

const INTERNAL_FIELDS = ['_isDummy', '_localId']

// Convert a single row object to a CSV row string
function rowToCSV(row: Record<string, unknown>): string {
  return Object.values(row)
    .map((val) => {
      if (val === null || val === undefined) return ''
      const str = String(val).replace(/"/g, '""')
      // Wrap in quotes if contains comma, newline, or quote
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str}"`
      }
      return str
    })
    .join(',')
}

// Strip internal metadata fields from a row
function cleanRow(row: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const key in row) {
    if (!INTERNAL_FIELDS.includes(key)) {
      cleaned[key] = row[key]
    }
  }
  return cleaned
}

// Format header keys from camelCase/snake_case to readable labels
function formatHeader(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// Main export function — triggers CSV download in browser
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data || data.length === 0) return

  const cleaned = data.map(cleanRow)
  const headers = Object.keys(cleaned[0])
  const headerRow = headers.map(formatHeader).join(',')
  const dataRows = cleaned.map(rowToCSV)
  const csv = [headerRow, ...dataRows].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
