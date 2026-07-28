import React, { useState } from 'react'
import { useBeds, useAllocations, useAllocateRoom, useVacateAllocation } from '../../hooks/useHostel'

export default function RoomAllocation() {
  const { data: beds } = useBeds()
  const { data: allocations, isLoading } = useAllocations({ status: 'active' })
  const allocate = useAllocateRoom()
  const vacate = useVacateAllocation()
  const [bedId, setBedId] = useState('')
  const [studentId, setStudentId] = useState('')

  const vacantBeds = (beds || []).filter(b => b.status === 'vacant')

  async function submit() {
    if (!bedId || !studentId.trim()) return
    await allocate.mutateAsync({ bed_id: bedId, student_id: studentId })
    setStudentId('')
    setBedId('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Room Allocation</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={bedId} onChange={e => setBedId(e.target.value)}>
          <option value="">Select vacant bed</option>
          {vacantBeds.map(b => <option key={b.id} value={b.id}>Bed {b.bed_number}</option>)}
        </select>
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <button onClick={submit}>Allocate</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (allocations || []).map(a => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>Student {a.student_id} — since {a.allocated_date}</span>
            <button onClick={() => vacate.mutate({ id: a.id, bed_id: a.bed_id })}>Vacate</button>
          </div>
        ))}
      </div>
    </div>
  )
}
