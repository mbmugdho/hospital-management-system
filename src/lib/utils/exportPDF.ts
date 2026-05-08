// Generates a professional PDF report using the browser's print API.
// No external PDF library needed — uses styled HTML printed to PDF.
// Works for both dashboard reports and individual invoice PDFs.

export interface PDFSection {
  title: string
  headers: string[]
  rows: string[][]
}

export interface PDFReportConfig {
  hospitalName: string
  reportTitle: string
  generatedAt: string
  sections: PDFSection[]
  summary?: { label: string; value: string }[]
}

// Build HTML string for the PDF report
function buildReportHTML(config: PDFReportConfig): string {
  const summaryHTML = config.summary
    ? `
      <div class="summary">
        ${config.summary
          .map(
            (item) => `
          <div class="summary-item">
            <span class="summary-label">${item.label}</span>
            <span class="summary-value">${item.value}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `
    : ''

  const sectionsHTML = config.sections
    .map(
      (section) => `
      <div class="section">
        <h2 class="section-title">${section.title}</h2>
        <table>
          <thead>
            <tr>
              ${section.headers.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${section.rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${config.reportTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            background: #fff;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 2px solid #6366f1;
          }
          .hospital-name {
            font-size: 22px;
            font-weight: 700;
            color: #6366f1;
          }
          .report-title {
            font-size: 14px;
            color: #555;
            margin-top: 4px;
          }
          .meta {
            text-align: right;
            color: #777;
            font-size: 11px;
          }
          .meta strong {
            display: block;
            font-size: 13px;
            color: #1a1a1a;
          }
          .summary {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 32px;
            background: #f5f5ff;
            padding: 16px;
            border-radius: 8px;
          }
          .summary-item {
            flex: 1;
            min-width: 120px;
          }
          .summary-label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            color: #777;
            letter-spacing: 0.5px;
          }
          .summary-value {
            display: block;
            font-size: 18px;
            font-weight: 700;
            color: #6366f1;
            margin-top: 2px;
          }
          .section {
            margin-bottom: 28px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6366f1;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e0e0ff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          thead tr {
            background: #6366f1;
            color: white;
          }
          th {
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          td {
            padding: 7px 10px;
            border-bottom: 1px solid #f0f0f0;
            color: #333;
          }
          tbody tr:nth-child(even) {
            background: #fafafe;
          }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 10px;
            color: #aaa;
          }
          @media print {
            body { padding: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">${config.hospitalName}</div>
            <div class="report-title">${config.reportTitle}</div>
          </div>
          <div class="meta">
            <strong>MediCore HMS</strong>
            Generated: ${config.generatedAt}
          </div>
        </div>

        ${summaryHTML}
        ${sectionsHTML}

        <div class="footer">
          This report was generated by MediCore Hospital Management System.
          Confidential — for internal use only.
        </div>
      </body>
    </html>
  `
}

// Open print dialog with styled HTML — browser saves as PDF
export function exportToPDF(config: PDFReportConfig): void {
  const html = buildReportHTML(config)
  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) return

  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for content to load then trigger print
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}
