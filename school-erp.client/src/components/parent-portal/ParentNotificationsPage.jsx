import React from 'react'
import { useNotifications, useMarkNotificationRead } from '../../hooks/useParentPortal'
import { useParentPortalContext } from './ParentPortalContext'
import PortalCard from './PortalCard'
import EmptyState from './EmptyState'

export default function ParentNotificationsPage() {
  const { parentId } = useParentPortalContext()
  const { data, isLoading } = useNotifications({ parent_id: parentId })
  const markRead = useMarkNotificationRead()
  const notifications = data || []

  return (
    <div>
      <h2>Notifications</h2>
      <PortalCard title="All Notifications">
        {isLoading ? 'Loading...' : notifications.length === 0 ? (
          <EmptyState>You're all caught up — no notifications.</EmptyState>
        ) : notifications.map(n => (
          <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', opacity: n.is_read ? 0.6 : 1 }}>
            <div>
              <div style={{ fontWeight: n.is_read ? 400 : 600 }}>{n.title}</div>
              {n.body && <div style={{ fontSize: 13.5 }}>{n.body}</div>}
            </div>
            {!n.is_read && <button onClick={() => markRead.mutate(n.id)}>Mark read</button>}
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
