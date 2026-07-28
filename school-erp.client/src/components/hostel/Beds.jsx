import React, { useState } from 'react'
import { useRooms, useBeds, useCreateBed, useUpdateBedStatus } from '../../hooks/useHostel'

export default function Beds() {
  const { data: rooms } = useRooms()
  const { data: beds, isLoading } = useBeds()
  const create = useCreateBed()
  const updateStatus = useUpdateBedStatus()
  const [roomId, setRoomId] = useState('')
  const [bedNumber, setBedNumber] = useState('')

  async function submit() {
    if (!roomId || !bedNumber.trim()) return
    await create.mutateAsync({ room_id: roomId, bed_number: bedNumber })
    setBedNumber('')
  }

  function roomLabel(id) {
    const r = rooms?.find(x => x.id === id)
    return r ? `Room ${r.room_number}` : id
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Beds</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="">Select room</option>
          {(rooms || []).map(r => <option key={r.id} value={r.id}>Room {r.room_number}</option>)}
        </select>
        <input placeholder="Bed number" value={bedNumber} onChange={e => setBedNumber(e.target.value)} />
        <button onClick={submit}>Add Bed</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (beds || []).map(b => (
          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>{roomLabel(b.room_id)} • Bed {b.bed_number} — {b.status}</span>
            <select value={b.status} onChange={e => updateStatus.mutate({ id: b.id, status: e.target.value })}>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
