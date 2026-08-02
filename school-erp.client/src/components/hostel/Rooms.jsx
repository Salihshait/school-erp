import React, { useState } from 'react'
import { useHostelBlocks } from '../../hooks/useHostel'
import { useRooms, useCreateRoom, useDeleteRoom } from '../../hooks/useHostel'

export default function Rooms() {
  const { data: blocks } = useHostelBlocks()
  const { data: rooms, isLoading } = useRooms()
  const create = useCreateRoom()
  const remove = useDeleteRoom()
  const [blockId, setBlockId] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [roomType, setRoomType] = useState('double')
  const [capacity, setCapacity] = useState(2)

  async function submit() {
    if (!blockId || !roomNumber.trim()) return
    await create.mutateAsync({ block_id: blockId, room_number: roomNumber, room_type: roomType, capacity: Number(capacity) || 2 })
    setRoomNumber('')
  }

  function blockName(id) {
    return blocks?.find(b => b.id === id)?.name || id
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Rooms</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={blockId} onChange={e => setBlockId(e.target.value)}>
          <option value="">Select block</option>
          {(blocks || []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input placeholder="Room number" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />
        <select value={roomType} onChange={e => setRoomType(e.target.value)}>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
          <option value="dormitory">Dormitory</option>
        </select>
        <input type="number" min="1" placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} style={{ width: 90 }} />
        <button onClick={submit}>Add Room</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (rooms || []).map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>{blockName(r.block_id)} • Room {r.room_number} — {r.room_type} (cap {r.capacity}) — {r.status}</span>
            <button className="btn-danger btn-sm" onClick={() => remove.mutate(r.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
