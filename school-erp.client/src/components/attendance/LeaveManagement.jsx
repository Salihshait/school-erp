import React, { useState } from 'react'
import { useCreateLeave } from '../../hooks/useAttendance'

export default function LeaveManagement() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const create = useCreateLeave()

  async function submit() {
    await create.mutateAsync({ person_id: '00000000-0000-0000-0000-000000000000', person_type: 'teacher', start_date: start, end_date: end, reason })
    alert('Leave requested')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Leave Management</h4>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
      </div>
      <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" />
      <div>
        <button onClick={submit}>Request Leave</button>
      </div>
    </div>
  )
}
