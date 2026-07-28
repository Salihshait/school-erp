import React from 'react'
import { useVehicleUtilization } from '../../hooks/useTransport'

export default function TransportDashboard() {
  const util = useVehicleUtilization()
  return (
    <div style={{ padding: 12, border: '1px solid #eee' }}>
      <h4>Transport Dashboard</h4>
      <div>
        {util.isLoading ? 'Loading...' : util.data?.map(u => <div key={u.vehicle_id}>{u.reg_no} — allocations: {u.allocations}</div>)}
      </div>
    </div>
  )
}
