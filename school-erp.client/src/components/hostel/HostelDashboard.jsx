import React from 'react'
import { useRoomOccupancy, useHostelFeeSummary, useComplaints, useVisitors } from '../../hooks/useHostel'

function StatCard({ label, value }) {
  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 100 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

export default function HostelDashboard() {
  const occupancy = useRoomOccupancy()
  const feeSummary = useHostelFeeSummary()
  const complaints = useComplaints({ status: 'open' })
  const visitors = useVisitors()

  const rooms = occupancy.data || []
  const totalBeds = rooms.reduce((sum, r) => sum + (r.occupied_beds || 0) + (r.vacant_beds || 0), 0)
  const occupiedBeds = rooms.reduce((sum, r) => sum + (r.occupied_beds || 0), 0)
  const pendingFees = (feeSummary.data || []).find(s => s.status === 'pending')?.count ?? 0
  const openComplaints = (complaints.data || []).length
  const inHostelVisitors = (visitors.data || []).filter(v => !v.check_out).length

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
      <h4 style={{ marginTop: 0 }}>Hostel Dashboard</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
        <StatCard label="Beds Occupied" value={occupancy.isLoading ? '—' : `${occupiedBeds}/${totalBeds}`} />
        <StatCard label="Pending Fees" value={feeSummary.isLoading ? '—' : pendingFees} />
        <StatCard label="Open Complaints" value={complaints.isLoading ? '—' : openComplaints} />
        <StatCard label="Visitors In" value={visitors.isLoading ? '—' : inHostelVisitors} />
      </div>
    </div>
  )
}
