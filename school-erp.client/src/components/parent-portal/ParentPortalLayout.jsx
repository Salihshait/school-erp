import React from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useParentProfile } from '../../hooks/useParentPortal'
import { ParentPortalProvider } from './ParentPortalContext'
import './ParentPortalLayout.css'

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

  if (authLoading) return <div className="parent-portal-status">Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  if (profileLoading) return <div className="parent-portal-status">Loading your account...</div>

  if (!parent) {
    return (
      <div className="parent-portal-status">
        <p>No parent account is linked to <strong>{user.email}</strong>.</p>
        <p>Please contact the school administration to link your account.</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <ParentPortalProvider parent={parent}>
      <div className="parent-shell">
        <header className="parent-header">
          <div>
            <div className="parent-header-title">Parent Portal</div>
            <div className="parent-header-student">
              {parent.students ? `${parent.students.first_name} ${parent.students.last_name}` : 'Student'}
            </div>
          </div>
          <button className="parent-signout" onClick={() => signOut()}>Sign out</button>
        </header>

        <nav className="parent-tabs">
          {TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `parent-tab${isActive ? ' active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <main className="parent-content">
          <Outlet />
        </main>
      </div>
    </ParentPortalProvider>
  )
}
