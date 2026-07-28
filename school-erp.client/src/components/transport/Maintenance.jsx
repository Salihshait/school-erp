import React, { useState } from 'react'
import { useMaintenance } from '../../hooks/useTransport'

export default function Maintenance() {
  const [vehicleId, setVehicleId] = useState('')
  const [desc, setDesc] = useState('')
  const [cost, setCost] = useState('')
  const m = useMaintenance()

  async function submit() {
    await m.mutateAsync({ vehicle_id: vehicleId, description: desc, cost: parseFloat(cost) })
    setVehicleId('')
    setDesc('')
    setCost('')
    alert('Maintenance recorded (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Vehicle Maintenance</h4>
      <div>
        <input placeholder="Vehicle ID" value={vehicleId} onChange={e => setVehicleId(e.target.value)} />
        <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input placeholder="Cost" value={cost} onChange={e => setCost(e.target.value)} />
      </div>
      <button onClick={submit}>Record</button>
    </div>
  )
}
