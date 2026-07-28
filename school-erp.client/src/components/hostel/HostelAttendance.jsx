import React, { useState } from 'react'
import { useHostelAttendance, useMarkHostelAttendance } from '../../hooks/useHostel'

const today = () => new Date().toISOString().slice(0, 10)

export default function HostelAttendance() {
  const [date, setDate] = useState(today())
  const { data, isLoading } = useHostelAttendance({ attendance_date: date })
  const mark = useMarkHostelAttendance()
  const [studentId, setStudentId] = useState('')
  const [status, setStatus] = useState('present')

  async function submit() {
    if (!studentId.trim()) return
    await mark.mutateAsync({ student_id: studentId, attendance_date: date, status })
    setStudentId('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Hostel Attendance</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
        <button onClick={submit}>Mark</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(a => (
          <div key={a.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
            Student {a.student_id} — {a.status}
          </div>
        ))}
      </div>
    </div>
  )
}
