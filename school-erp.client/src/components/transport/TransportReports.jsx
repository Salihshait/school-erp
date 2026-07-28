import React from 'react'
import TransportChart from './TransportChart'
import { exportToXlsx } from '../../utils/export'

export default function TransportReports() {
  return (
    <div style={{ padding: 12, border: '1px solid #eee' }}>
      <h4>Transport Reports</h4>
      <TransportChart />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => exportToXlsx([], 'transport-report.xlsx')}>Export</button>
      </div>
    </div>
  )
}
