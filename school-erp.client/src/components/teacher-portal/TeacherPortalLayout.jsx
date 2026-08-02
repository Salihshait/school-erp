import React from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useTeacherProfile } from '../../hooks/useTeacherPortal'
import { TeacherPortalProvider } from './TeacherPortalContext'
import '../common/PortalLayout.css'

const TABS = [
  { to: '/teacher-portal', label: 'Attendance', end: true },
  { to: '/teacher-portal/student-attendance', label: 'Student Attendance' },
  { to: '/teacher-portal/homework', label: 'Homework' },
  { to: '/teacher-portal/assignments', label: 'Assignment Upload' },
  { to: '/teacher-portal/marks', label: 'Exam Marks' },
  { to: '/teacher-portal/timetable', label: 'Timetable' },
  { to: '/teacher-portal/salary', label: 'Salary' },
  { to: '/teacher-portal/leave', label: 'Leave' },
  { to: '/teacher-portal/notice', label: 'Notice' },
  { to: '/teacher-portal/profile', label: 'Profile' },
]

export default function TeacherPortalLayout() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { data: teacher, isLoading: profileLoading } = useTeacherProfile()

  if (authLoading) return <div className="portal-status">Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  if (profileLoading) return <div className="portal-status">Loading your account...</div>

  if (!teacher) {
    return (
      <div className="portal-status">
        <p>No teacher account is linked to <strong>{user.email}</strong>.</p>
        <p>Please contact the school administration to link your account.</p>
        <button className="portal-signout" onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <TeacherPortalProvider teacher={teacher}>
      <div className="portal-shell">
        <header className="portal-header">
          <div>
            <div className="portal-header-title">Teacher Portal</div>
            <div className="portal-header-subtitle">{teacher.first_name} {teacher.last_name}</div>
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
    </TeacherPortalProvider>
  )
}
