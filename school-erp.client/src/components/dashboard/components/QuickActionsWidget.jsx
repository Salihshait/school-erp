import React from 'react'
import { Link } from 'react-router-dom'
import PortalCard from '../../common/PortalCard'

const ACTIONS = [
  { to: '/student/new', label: 'Add Student' },
  { to: '/teacher/new', label: 'Add Teacher' },
  { to: '/attendance', label: 'Mark Attendance' },
  { to: '/reports', label: 'View Reports' },
  { to: '/export', label: 'Run Export' },
  { to: '/settings', label: 'Settings' },
]

export default function QuickActionsWidget() {
  return (
    <PortalCard title="Quick Actions">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ACTIONS.map(a => (
          <Link
            key={a.to}
            to={a.to}
            style={{
              padding: '8px 12px',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: 13.5,
            }}
          >
            {a.label}
          </Link>
        ))}
      </div>
    </PortalCard>
  )
}
