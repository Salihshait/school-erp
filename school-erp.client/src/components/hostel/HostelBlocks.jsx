import React, { useState } from 'react'
import { useHostelBlocks, useCreateHostelBlock, useDeleteHostelBlock } from '../../hooks/useHostel'

export default function HostelBlocks() {
  const { data, isLoading } = useHostelBlocks()
  const create = useCreateHostelBlock()
  const remove = useDeleteHostelBlock()
  const [name, setName] = useState('')
  const [warden, setWarden] = useState('')
  const [floors, setFloors] = useState(1)

  async function submit() {
    if (!name.trim()) return
    await create.mutateAsync({ name, warden_name: warden, total_floors: Number(floors) || 1 })
    setName('')
    setWarden('')
    setFloors(1)
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Hostel Blocks</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Block name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Warden name" value={warden} onChange={e => setWarden(e.target.value)} />
        <input type="number" min="1" placeholder="Floors" value={floors} onChange={e => setFloors(e.target.value)} style={{ width: 80 }} />
        <button onClick={submit}>Add Block</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(b => (
          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>{b.name} — Warden: {b.warden_name || '—'} — Floors: {b.total_floors}</span>
            <button onClick={() => remove.mutate(b.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
