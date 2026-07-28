import React from 'react'

export default function StatCard({ title, value, delta }) {
  return (
    <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)' }}>
      <div style={{ fontSize: 12, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-h)' }}>{value}</div>
      {typeof delta !== 'undefined' && <div style={{ fontSize: 12, color: delta >= 0 ? '#16a34a' : '#dc2626' }}>{delta >= 0 ? `+${delta}` : delta}</div>}
    </div>
  )
}
