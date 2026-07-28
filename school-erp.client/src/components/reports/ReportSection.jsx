import React, { useRef } from 'react'
import { exportToXlsx } from '../../utils/export'
import { exportElementToPdf } from '../../utils/report'

export default function ReportSection({ title, rows, filename, children }) {
  const ref = useRef(null)

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => exportToXlsx(rows || [], `${filename}.xlsx`)}>Export Excel</button>
          <button onClick={() => exportElementToPdf(ref.current, `${filename}.pdf`)}>Export PDF</button>
        </div>
      </div>
      <div ref={ref}>{children}</div>
    </div>
  )
}
