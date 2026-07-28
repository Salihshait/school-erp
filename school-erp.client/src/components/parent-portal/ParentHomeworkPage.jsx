import React from 'react'
import { useHomework } from '../../hooks/useParentPortal'
import { useParentPortalContext } from './ParentPortalContext'
import PortalCard from './PortalCard'
import EmptyState from './EmptyState'

export default function ParentHomeworkPage() {
  const { student } = useParentPortalContext()
  const { data, isLoading } = useHomework({ class_id: student?.class_id, section: student?.section })
  const items = data || []

  return (
    <div>
      <h2>Homework</h2>
      <PortalCard title="Assignments">
        {isLoading ? 'Loading...' : items.length === 0 ? (
          <EmptyState>No homework assigned yet.</EmptyState>
        ) : items.map(h => (
          <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{h.subject}: {h.title}</div>
            {h.description && <div style={{ fontSize: 13.5, color: 'var(--text)' }}>{h.description}</div>}
            <div style={{ fontSize: 12.5, color: 'var(--text)' }}>Due: {h.due_date || '—'}</div>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
