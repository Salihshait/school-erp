import React from 'react'
import { useEvents } from '../../hooks/useParentPortal'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function ParentEventsPage() {
  const { data, isLoading } = useEvents()
  const events = data || []

  return (
    <div>
      <h2>School Events</h2>
      <PortalCard title="Upcoming Events">
        {isLoading ? 'Loading...' : events.length === 0 ? (
          <EmptyState>No upcoming events.</EmptyState>
        ) : events.map(e => (
          <div key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{e.title}</div>
            {e.description && <div style={{ fontSize: 13.5 }}>{e.description}</div>}
            <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{e.event_date}{e.location ? ` • ${e.location}` : ''}</div>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
