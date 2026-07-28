import React, { useState } from 'react'
import { useLeaveRequests, useCreateLeave } from '../../hooks/useAttendance'
import { useParentPortalContext } from './ParentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function ParentLeaveRequestPage() {
  const { studentId, parentId } = useParentPortalContext()
  const { data, isLoading } = useLeaveRequests({ person_id: studentId, person_type: 'student' })
  const create = useCreateLeave()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reason, setReason] = useState('')

  async function submit() {
    if (!fromDate || !toDate || !reason.trim()) return
    await create.mutateAsync({
      person_id: studentId,
      person_type: 'student',
      start_date: fromDate,
      end_date: toDate,
      reason,
      requested_by: parentId,
    })
    setFromDate('')
    setToDate('')
    setReason('')
  }

  const requests = data || []

  return (
    <div>
      <h2>Leave Request</h2>
      <PortalCard title="New Request">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>From <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ width: '100%', padding: 8 }} /></label>
          <label>To <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ width: '100%', padding: 8 }} /></label>
          <label>Reason <textarea value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', padding: 8 }} rows={3} /></label>
          <button onClick={submit}>Submit Request</button>
        </div>
      </PortalCard>

      <PortalCard title="Request History">
        {isLoading ? 'Loading...' : requests.length === 0 ? (
          <EmptyState>No leave requests yet.</EmptyState>
        ) : requests.map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{r.start_date} → {r.end_date}: {r.reason}</span>
            <span style={{ textTransform: 'capitalize' }}>{r.status}</span>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
