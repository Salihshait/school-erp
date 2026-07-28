import React, { useState } from 'react'
import { useVisitors, useLogVisitorCheckIn, useLogVisitorCheckOut } from '../../hooks/useHostel'

export default function Visitors() {
  const { data, isLoading } = useVisitors()
  const checkIn = useLogVisitorCheckIn()
  const checkOut = useLogVisitorCheckOut()
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('')
  const [purpose, setPurpose] = useState('')

  async function submit() {
    if (!studentId.trim() || !name.trim()) return
    await checkIn.mutateAsync({ student_id: studentId, visitor_name: name, relation, purpose })
    setName('')
    setRelation('')
    setPurpose('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Visitors</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <input placeholder="Visitor name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Relation" value={relation} onChange={e => setRelation(e.target.value)} />
        <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} />
        <button onClick={submit}>Check In</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(v => (
          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>{v.visitor_name} ({v.relation || '—'}) → Student {v.student_id} — {v.check_out ? 'Checked out' : 'In hostel'}</span>
            {!v.check_out && <button onClick={() => checkOut.mutate(v.id)}>Check Out</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
