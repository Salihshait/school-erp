import React from 'react'

export default function StatCard({ title, value, delta }) {
  return (
    <div style={{ padding: 16, border: '1px solid #e6e6e6', borderRadius: 8, background: '#fff' }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
      {typeof delta !== 'undefined' && <div style={{ fontSize: 12, color: delta >= 0 ? '#16a34a' : '#dc2626' }}>{delta >= 0 ? `+${delta}` : delta}</div>}
    </div>
  )
}
