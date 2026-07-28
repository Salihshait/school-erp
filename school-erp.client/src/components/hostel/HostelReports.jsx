import React from 'react'
import HostelChart from './HostelChart'
import { useRoomOccupancy } from '../../hooks/useHostel'
import { exportToXlsx } from '../../utils/export'

export default function HostelReports() {
  const occupancy = useRoomOccupancy()

  return (
    <div>
      <h3>Reports & Dashboard</h3>
      <HostelChart />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => exportToXlsx(occupancy.data || [], 'hostel-occupancy.xlsx')}>Export Occupancy XLSX</button>
      </div>
    </div>
  )
}
