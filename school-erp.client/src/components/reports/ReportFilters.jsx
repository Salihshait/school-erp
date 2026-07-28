import React from 'react'

export default function ReportFilters({ from, to, onFromChange, onToChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 13.5 }}>
        From{' '}
        <input type="month" value={from} onChange={e => onFromChange(e.target.value)} />
      </label>
      <label style={{ fontSize: 13.5 }}>
        To{' '}
        <input type="month" value={to} onChange={e => onToChange(e.target.value)} />
      </label>
    </div>
  )
}

export function filterByMonthRange(rows, dateKey, from, to) {
  return (rows || []).filter(row => {
    const month = String(row[dateKey] || '').slice(0, 7)
    if (from && month < from) return false
    if (to && month > to) return false
    return true
  })
}
