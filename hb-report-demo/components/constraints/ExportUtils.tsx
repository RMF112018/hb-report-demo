import { format } from "date-fns"
import type { Constraint, ConstraintStats } from "@/types/constraint"

export class ConstraintExportUtils {
  /**
   * Export constraints to PDF format
   */
  static async exportToPDF(
    constraints: Constraint[], 
    stats: ConstraintStats, 
    projectScope: string, 
    fileName: string
  ): Promise<void> {
    try {
      // Create a printable HTML version
      const htmlContent = this.generatePrintableHTML(constraints, stats, projectScope, fileName)
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.focus()
        
        // Auto-print when ready
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } catch (error) {
      console.error('PDF export failed:', error)
      throw new Error('Failed to export PDF')
    }
  }

  /**
   * Export constraints to Excel format (CSV)
   */
  static async exportToExcel(
    constraints: Constraint[], 
    stats: ConstraintStats, 
    projectScope: string, 
    fileName: string
  ): Promise<void> {
    try {
      const csvData = this.generateCSVData(constraints)
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      this.downloadFile(blob, `${fileName}.csv`)
    } catch (error) {
      console.error('Excel export failed:', error)
      throw new Error('Failed to export to Excel')
    }
  }

  /**
   * Export constraints to CSV format
   */
  static async exportToCSV(
    constraints: Constraint[], 
    projectScope: string, 
    fileName: string
  ): Promise<void> {
    try {
      const csvData = this.generateCSVData(constraints)
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      this.downloadFile(blob, `${fileName}.csv`)
    } catch (error) {
      console.error('CSV export failed:', error)
      throw new Error('Failed to export CSV')
    }
  }

  /**
   * Generate printable HTML for PDF export
   */
  private static generatePrintableHTML(
    constraints: Constraint[], 
    stats: ConstraintStats, 
    projectScope: string, 
    fileName: string
  ): string {
    const currentDate = format(new Date(), 'MMMM dd, yyyy')
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${fileName} - Constraints Report</title>
          <style>
            @media print {
              body { margin: 0; }
              .page-break { page-break-before: always; }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #003087;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #003087;
              margin: 0;
              font-size: 24px;
            }
            .header .subtitle {
              color: #666;
              margin: 10px 0;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            .stat-card .number {
              font-size: 28px;
              font-weight: bold;
              color: #003087;
            }
            .stat-card .label {
              color: #666;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              color: #003087;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
            }
            .status-identified { background-color: #fff3cd; color: #856404; }
            .status-pending { background-color: #f8d7da; color: #721c24; }
            .status-in-progress { background-color: #d1ecf1; color: #0c5460; }
            .status-closed { background-color: #d4edda; color: #155724; }
            .category-section {
              margin-bottom: 30px;
            }
            .category-title {
              background-color: #003087;
              color: white;
              padding: 10px;
              margin: 20px 0 10px 0;
              border-radius: 4px;
            }
            .overdue {
              color: #dc3545;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Constraints Log Report</h1>
            <div class="subtitle">${projectScope}</div>
            <div class="subtitle">Generated on ${currentDate}</div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="number">${stats.total}</div>
              <div class="label">Total Constraints</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.open}</div>
              <div class="label">Open Constraints</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.closed}</div>
              <div class="label">Closed Constraints</div>
            </div>
            <div class="stat-card">
              <div class="number">${stats.overdue}</div>
              <div class="label">Overdue Constraints</div>
            </div>
          </div>

          ${this.generateConstraintTables(constraints)}
        </body>
      </html>
    `
  }

  /**
   * Generate constraint tables grouped by category
   */
  private static generateConstraintTables(constraints: Constraint[]): string {
    const constraintsByCategory = constraints.reduce((acc, constraint) => {
      const category = constraint.category
      if (!acc[category]) acc[category] = []
      acc[category].push(constraint)
      return acc
    }, {} as Record<string, Constraint[]>)

    return Object.entries(constraintsByCategory)
      .map(([category, categoryConstraints]) => `
        <div class="category-section">
          <h3 class="category-title">${category} (${categoryConstraints.length} constraints)</h3>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Date Identified</th>
                <th>Due Date</th>
                <th>Days Elapsed</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              ${categoryConstraints.map(constraint => `
                <tr>
                  <td>${constraint.no}</td>
                  <td>${constraint.description}</td>
                  <td>
                    <span class="status-badge status-${constraint.completionStatus.toLowerCase().replace(' ', '-')}">
                      ${constraint.completionStatus}
                    </span>
                  </td>
                  <td>${constraint.assigned}</td>
                  <td>${constraint.dateIdentified ? format(new Date(constraint.dateIdentified), 'MMM dd, yyyy') : ''}</td>
                  <td class="${this.isOverdue(constraint) ? 'overdue' : ''}">
                    ${constraint.dueDate ? format(new Date(constraint.dueDate), 'MMM dd, yyyy') : ''}
                  </td>
                  <td>${constraint.daysElapsed} days</td>
                  <td>${constraint.reference}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')
  }

  /**
   * Generate CSV data from constraints
   */
  private static generateCSVData(constraints: Constraint[]): string {
    const headers = [
      'No.',
      'Category',
      'Description',
      'Status',
      'Assigned',
      'Date Identified',
      'Due Date',
      'Date Closed',
      'Days Elapsed',
      'Reference',
      'Closure Document',
      'BIC',
      'Comments'
    ]

    const csvRows = [
      headers.join(','),
      ...constraints.map(constraint => [
        `"${constraint.no}"`,
        `"${constraint.category}"`,
        `"${constraint.description.replace(/"/g, '""')}"`,
        `"${constraint.completionStatus}"`,
        `"${constraint.assigned}"`,
        `"${constraint.dateIdentified ? format(new Date(constraint.dateIdentified), 'yyyy-MM-dd') : ''}"`,
        `"${constraint.dueDate ? format(new Date(constraint.dueDate), 'yyyy-MM-dd') : ''}"`,
        `"${constraint.dateClosed ? format(new Date(constraint.dateClosed), 'yyyy-MM-dd') : ''}"`,
        `"${constraint.daysElapsed}"`,
        `"${constraint.reference}"`,
        `"${constraint.closureDocument}"`,
        `"${constraint.bic}"`,
        `"${constraint.comments.replace(/"/g, '""')}"`
      ].join(','))
    ]

    return csvRows.join('\n')
  }

  /**
   * Download file helper
   */
  private static downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * Check if constraint is overdue
   */
  private static isOverdue(constraint: Constraint): boolean {
    if (constraint.completionStatus === "Closed" || !constraint.dueDate) return false
    return new Date(constraint.dueDate) < new Date()
  }
} 