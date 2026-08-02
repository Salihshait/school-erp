import React from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useStudentProfile } from '../../hooks/useStudentPortal'
import { StudentPortalProvider } from './StudentPortalContext'
import '../common/PortalLayout.css'

const TABS = [
  { to: '/student-portal', label: 'Dashboard', end: true },
  { to: '/student-portal/attendance', label: 'Attendance' },
  { to: '/student-portal/homework', label: 'Homework' },
  { to: '/student-portal/assignments', label: 'Assignments' },
  { to: '/student-portal/results', label: 'Exam Results' },
  { to: '/student-portal/fees', label: 'Fees' },
  { to: '/student-portal/library', label: 'Library' },
  { to: '/student-portal/timetable', label: 'Timetable' },
  { to: '/student-portal/notes', label: 'Notes' },
  { to: '/student-portal/certificates', label: 'Certificates' },
  { to: '/student-portal/profile', label: 'Profile' },
]

export default function StudentPortalLayout() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { data: student, isLoading: profileLoading } = useStudentProfile()

  if (authLoading) return <div className="portal-status">Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  if (profileLoading) return <div className="portal-status">Loading your account...</div>

  if (!student) {
    return (
      <div className="portal-status">
        <p>No student account is linked to <strong>{user.email}</strong>.</p>
        <p>Please contact the school administration to link your account.</p>
        <button className="portal-signout" onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <StudentPortalProvider student={student}>
      <div className="portal-shell">
        <header className="portal-header">
          <div>
            <div className="portal-header-title">Student Portal</div>
            <div className="portal-header-subtitle">{student.first_name} {student.last_name}</div>
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
    </StudentPortalProvider>
  )
}
