import React from 'react'

export default function AttendanceTable({ teacherId }) {
  const rows = [
    { id: 1, date: '2026-07-20', status: 'present' },
    { id: 2, date: '2026-07-21', status: 'absent' }
  ]

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      {rows.map(r => (
        <div key={r.id} style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{r.date} • {r.status}</div>
      ))}
    </div>
  )
}
