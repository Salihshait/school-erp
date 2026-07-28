import React from 'react'

export default function Timetable({ teacherId }) {
  // placeholder; in production, fetch /api/teacher/:id/timetable
  const slots = [
    { id: 's1', day: 'Mon', start: '09:00', end: '10:00', subject: 'Math' },
    { id: 's2', day: 'Tue', start: '10:00', end: '11:00', subject: 'Science' }
  ]

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
      {slots.map(s => (
        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
          <div>{s.day} • {s.subject}</div>
          <div>{s.start} - {s.end}</div>
        </div>
      ))}
    </div>
  )
}
