import React from 'react'
import { useRecentAdmissions } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'
import EmptyState from '../../common/EmptyState'

export default function RecentAdmissionsWidget() {
  const { data, isLoading } = useRecentAdmissions(5)
  const admissions = data || []

  return (
    <PortalCard title="Recent Admissions">
      {isLoading ? 'Loading...' : admissions.length === 0 ? (
        <EmptyState>No recent admissions.</EmptyState>
      ) : admissions.map(a => (
        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
          <span>{a.student_name}</span>
          <span style={{ fontSize: 12.5, color: 'var(--text)' }}>{new Date(a.admission_date).toLocaleDateString()}</span>
        </div>
      ))}
    </PortalCard>
  )
}
