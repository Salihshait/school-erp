import React from 'react'
import ExamChart from './ExamChart'
import { exportToXlsx } from '../../utils/export'

export default function ExamReports() {
  return (
    <div style={{ marginTop: 12 }}>
      <h4>Exam Reports</h4>
      <ExamChart />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => exportToXlsx([], 'exam-report.xlsx')}>Export Report XLSX</button>
      </div>
    </div>
  )
}
