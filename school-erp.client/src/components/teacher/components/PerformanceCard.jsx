import React from 'react'

export default function PerformanceCard({ teacherId }) {
  const reviews = [ { id: 1, date: '2026-06-01', score: 4.5, comments: 'Excellent' } ]
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
      {reviews.map(r => (
        <div key={r.id} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>{r.score} / 5</div>
          <div style={{ fontSize: 13 }}>{r.comments}</div>
        </div>
      ))}
    </div>
  )
}
