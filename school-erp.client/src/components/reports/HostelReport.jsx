import React from 'react'
import { useRoomOccupancy } from '../../hooks/useHostel'
import HostelChart from '../hostel/HostelChart'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

export default function HostelReport() {
  const { data, isLoading } = useRoomOccupancy()
  const rows = data || []

  return (
    <div>
      <h2>Hostel Report</h2>
      <ReportSection title="Occupancy per Room" rows={rows} filename="hostel-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No room occupancy data yet.</EmptyState>
        ) : (
          <>
            <HostelChart />
            {rows.map(r => (
              <div key={r.room_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.block_name} • Room {r.room_number}</span>
                <span>Occupied {r.occupied_beds} • Vacant {r.vacant_beds}</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
