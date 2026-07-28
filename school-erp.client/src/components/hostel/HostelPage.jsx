import React from 'react'
import HostelBlocks from './HostelBlocks'
import Rooms from './Rooms'
import Beds from './Beds'
import RoomAllocation from './RoomAllocation'
import MessManagement from './MessManagement'
import Visitors from './Visitors'
import HostelAttendance from './HostelAttendance'
import HostelFees from './HostelFees'
import Complaints from './Complaints'
import HostelDashboard from './HostelDashboard'
import HostelReports from './HostelReports'

export default function HostelPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Hostel Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <HostelBlocks />
          <Rooms />
          <Beds />
          <RoomAllocation />
          <MessManagement />
          <Visitors />
          <HostelAttendance />
          <HostelFees />
          <Complaints />
        </div>
        <div>
          <HostelDashboard />
          <HostelReports />
        </div>
      </div>
    </div>
  )
}
