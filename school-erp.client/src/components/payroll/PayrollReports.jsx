import React from 'react'
import PayrollChart from './PayrollChart'
import { usePayrollSummary } from '../../hooks/usePayroll'
import { exportToXlsx } from '../../utils/export'

export default function PayrollReports() {
  const summary = usePayrollSummary()

  return (
    <div>
      <h3>Reports & Dashboard</h3>
      <PayrollChart />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => exportToXlsx(summary.data || [], 'payroll-summary.xlsx')}>Export Summary XLSX</button>
      </div>
    </div>
  )
}
