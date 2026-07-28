import React, { useState } from 'react'
import { useAllocateVehicle } from '../../hooks/useTransport'

export default function Allocation() {
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [routeId, setRouteId] = useState('')
  const allocate = useAllocateVehicle()

  async function submit() {
    await allocate.mutateAsync({ vehicle_id: vehicleId, driver_id: driverId, route_id: routeId, start_date: new Date().toISOString() })
    setVehicleId('')
    setDriverId('')
    setRouteId('')
    alert('Allocated (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Allocate Vehicle</h4>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Vehicle ID" value={vehicleId} onChange={e => setVehicleId(e.target.value)} />
        <input placeholder="Driver ID" value={driverId} onChange={e => setDriverId(e.target.value)} />
        <input placeholder="Route ID" value={routeId} onChange={e => setRouteId(e.target.value)} />
      </div>
      <button onClick={submit}>Allocate</button>
    </div>
  )
}
