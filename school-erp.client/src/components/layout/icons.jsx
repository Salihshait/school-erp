import React from 'react'

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function DashboardIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  )
}

export function StudentsIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="7" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="8" r="2.4" />
      <path d="M15.5 20c.2-2.6 1.6-4.6 3.6-5.4" />
    </svg>
  )
}

export function TeachersIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
      <path d="M3 12h18" />
    </svg>
  )
}

export function AttendanceIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M8 3v3M16 3v3" />
      <path d="m8.5 14 2.2 2.2L15.5 12" />
    </svg>
  )
}

export function ExportIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19.5h16" />
    </svg>
  )
}

export function LogoutIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3.5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h3" />
      <path d="M16 16.5 21 12l-5-4.5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  )
}
