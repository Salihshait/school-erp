import React from 'react'
import { exportToXlsx } from '../../utils/export'

export default function Reports() {
  return (
    <div style={{ padding: 12, border: '1px solid #eee' }}>
      <h4>Library Reports</h4>
      <div>
        <button onClick={() => exportToXlsx([], 'library-report.xlsx')}>Export Book Report</button>
      </div>
    </div>
  )
}
