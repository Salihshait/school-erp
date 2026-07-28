import React from 'react'
import { useNotices } from '../../hooks/useParentPortal'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function ParentNoticesPage() {
  const { data, isLoading } = useNotices()
  const notices = data || []

  return (
    <div>
      <h2>Notice Board</h2>
      <PortalCard title="Notices">
        {isLoading ? 'Loading...' : notices.length === 0 ? (
          <EmptyState>No notices posted yet.</EmptyState>
        ) : notices.map(n => (
          <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{n.title}</div>
            <div style={{ fontSize: 13.5 }}>{n.body}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{new Date(n.posted_at).toLocaleDateString()}</div>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
