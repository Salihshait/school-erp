import React from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useParentProfile } from '../../hooks/useParentPortal'
import { ParentPortalProvider } from './ParentPortalContext'
import '../common/PortalLayout.css'

const TABS = [
  { to: '/parent', label: 'Attendance', end: true },
  { to: '/parent/marks', label: 'Marks' },
  { to: '/parent/homework', label: 'Homework' },
  { to: '/parent/report-card', label: 'Report Card' },
  { to: '/parent/fees', label: 'Fees' },
  { to: '/parent/notices', label: 'Notices' },
  { to: '/parent/events', label: 'Events' },
  { to: '/parent/chat', label: 'Teacher Chat' },
  { to: '/parent/leave', label: 'Leave Request' },
  { to: '/parent/notifications', label: 'Notifications' },
]

export default function ParentPortalLayout() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { data: parent, isLoading: profileLoading } = useParentProfile()

  if (authLoading) return <div className="portal-status">Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  if (profileLoading) return <div className="portal-status">Loading your account...</div>

  if (!parent) {
    return (
      <div className="portal-status">
        <p>No parent account is linked to <strong>{user.email}</strong>.</p>
        <p>Please contact the school administration to link your account.</p>
        <button className="portal-signout" onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <ParentPortalProvider parent={parent}>
      <div className="portal-shell">
        <header className="portal-header">
          <div>
            <div className="portal-header-title">Parent Portal</div>
            <div className="portal-header-subtitle">
              {parent.students ? `${parent.students.first_name} ${parent.students.last_name}` : 'Student'}
            </div>
          </div>
          <button className="portal-signout" onClick={() => signOut()}>Sign out</button>
        </header>

        <nav className="portal-tabs">
          {TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `portal-tab${isActive ? ' active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </ParentPortalProvider>
  )
}
