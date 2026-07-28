import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { DashboardIcon, StudentsIcon, TeachersIcon, AttendanceIcon, HostelIcon, PayrollIcon, ExportIcon, LogoutIcon, MenuIcon } from './icons'
import './AppLayout.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/student', label: 'Students', icon: StudentsIcon },
  { to: '/teacher', label: 'Teachers', icon: TeachersIcon },
  { to: '/attendance', label: 'Attendance', icon: AttendanceIcon },
  { to: '/hostel', label: 'Hostel', icon: HostelIcon },
  { to: '/payroll', label: 'Payroll', icon: PayrollIcon },
  { to: '/export', label: 'Export', icon: ExportIcon },
]

function pageTitle(pathname) {
  const match = [...NAV_ITEMS].reverse().find(item =>
    item.end ? pathname === item.to : pathname.startsWith(item.to)
  )
  return match ? match.label : 'School ERP'
}

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`app-sidebar${navOpen ? ' open' : ''}`}>
        <div className="app-brand">
          <span className="app-brand-mark">S</span>
          <span className="app-brand-name">School ERP</span>
        </div>
        <nav className="app-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {navOpen && <div className="app-sidebar-scrim" onClick={() => setNavOpen(false)} />}

      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <button
              type="button"
              className="app-nav-toggle"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen(v => !v)}
            >
              <MenuIcon />
            </button>
            <h1 className="app-topbar-title">{pageTitle(location.pathname)}</h1>
          </div>
          <div className="app-topbar-right">
            {user ? (
              <div className="app-user">
                <span className="app-user-email">{user.email}</span>
                <button type="button" className="app-user-signout" onClick={() => signOut()}>
                  <LogoutIcon />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className="app-signin-link">Sign in</NavLink>
            )}
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
