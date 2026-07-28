import React from 'react'

export default function ClassSummary({ classes = [], loading = false }) {
  if (loading) return <div>Loading classes...</div>
  if (!classes || classes.length === 0) return <div>No classes found</div>

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {classes.map(c => (
        <div key={c.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{c.teacher || ''} • {c.grade_level || ''}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700 }}>{c.students ?? '-'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>students</div>
          </div>
        </div>
      ))}
    </div>
  )
}
