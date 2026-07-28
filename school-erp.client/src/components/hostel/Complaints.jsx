import React, { useState } from 'react'
import { useComplaints, useRaiseComplaint, useUpdateComplaintStatus } from '../../hooks/useHostel'

const CATEGORIES = ['maintenance', 'mess', 'discipline', 'other']

export default function Complaints() {
  const { data, isLoading } = useComplaints()
  const raise = useRaiseComplaint()
  const updateStatus = useUpdateComplaintStatus()
  const [studentId, setStudentId] = useState('')
  const [category, setCategory] = useState('maintenance')
  const [description, setDescription] = useState('')

  async function submit() {
    if (!studentId.trim() || !description.trim()) return
    await raise.mutateAsync({ student_id: studentId, category, description })
    setDescription('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Complaints</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ minWidth: 220 }} />
        <button onClick={submit}>Raise Complaint</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>[{c.category}] {c.description} — Student {c.student_id}</span>
            <select value={c.status} onChange={e => updateStatus.mutate({ id: c.id, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
