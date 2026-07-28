import React from 'react'
import { usePersonAttendance } from '../../hooks/useAttendance'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function TeacherAttendancePage() {
  const { teacherId } = useTeacherPortalContext()
  const { data, isLoading } = usePersonAttendance({ person_id: teacherId, person_type: 'teacher' })

  const records = data || []
  const presentCount = records.filter(r => r.status === 'present').length
  const percentage = records.length ? Math.round((presentCount / records.length) * 100) : null

  return (
    <div>
      <h2>Attendance</h2>
      <PortalCard title="Summary">
        {isLoading ? 'Loading...' : percentage == null ? 'No attendance recorded yet.' : `${percentage}% present (${presentCount}/${records.length} days)`}
      </PortalCard>
      <PortalCard title="Recent Records">
        {isLoading ? 'Loading...' : records.length === 0 ? (
          <EmptyState>No attendance records yet.</EmptyState>
        ) : records.map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{new Date(r.recorded_at).toLocaleDateString()}</span>
            <span style={{ textTransform: 'capitalize' }}>{r.status}</span>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
