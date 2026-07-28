import React from 'react'
import { useRecentNotices } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'
import EmptyState from '../../common/EmptyState'

export default function RecentNoticesWidget() {
  const { data, isLoading } = useRecentNotices(5)
  const notices = data || []

  return (
    <PortalCard title="Recent Notices">
      {isLoading ? 'Loading...' : notices.length === 0 ? (
        <EmptyState>No notices posted yet.</EmptyState>
      ) : notices.map(n => (
        <div key={n.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 600 }}>{n.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{new Date(n.posted_at).toLocaleDateString()}</div>
        </div>
      ))}
    </PortalCard>
  )
}
