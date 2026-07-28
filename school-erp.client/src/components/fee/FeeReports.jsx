import React from 'react'
import FeeChart from './FeeChart'
import { exportToXlsx } from '../../utils/export'

export default function FeeReports() {
  return (
    <div>
      <h3>Reports & Dashboard</h3>
      <FeeChart />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => exportToXlsx([], 'fees.xlsx')}>Export Fees XLSX</button>
      </div>
    </div>
  )
}
