import React from 'react'
import AttendanceChart from './AttendanceChart'
import { exportToXlsx } from '../../utils/export'

export default function AttendanceReports() {
  return (
    <div style={{ marginTop: 12 }}>
      <h4>Reports</h4>
      <AttendanceChart />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => exportToXlsx([], 'attendance.xlsx')}>Export XLSX (demo)</button>
        <button style={{ marginLeft: 8 }} onClick={() => alert('Export PDF placeholder')}>Export PDF</button>
      </div>
    </div>
  )
}
