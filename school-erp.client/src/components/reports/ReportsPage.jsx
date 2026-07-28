import React, { useState } from 'react'
import ReportsDashboard from './ReportsDashboard'
import AdmissionsReport from './AdmissionsReport'
import AttendanceReport from './AttendanceReport'
import FeesReport from './FeesReport'
import ExamsReport from './ExamsReport'
import LibraryReport from './LibraryReport'
import PayrollReport from './PayrollReport'
import TransportReport from './TransportReport'
import HostelReport from './HostelReport'
import StudentPerformanceReport from './StudentPerformanceReport'
import TeacherPerformanceReport from './TeacherPerformanceReport'

const CATEGORIES = [
  { key: 'dashboard', label: 'Dashboard', Component: ReportsDashboard },
  { key: 'admissions', label: 'Admissions', Component: AdmissionsReport },
  { key: 'attendance', label: 'Attendance', Component: AttendanceReport },
  { key: 'fees', label: 'Fees', Component: FeesReport },
  { key: 'exams', label: 'Exams', Component: ExamsReport },
  { key: 'library', label: 'Library', Component: LibraryReport },
  { key: 'payroll', label: 'Payroll', Component: PayrollReport },
  { key: 'transport', label: 'Transport', Component: TransportReport },
  { key: 'hostel', label: 'Hostel', Component: HostelReport },
  { key: 'student-performance', label: 'Student Performance', Component: StudentPerformanceReport },
  { key: 'teacher-performance', label: 'Teacher Performance', Component: TeacherPerformanceReport },
]

export default function ReportsPage() {
  const [active, setActive] = useState('dashboard')
  const Active = CATEGORIES.find(c => c.key === active)?.Component || ReportsDashboard

  return (
    <div style={{ padding: 16 }}>
      <h1>Reports</h1>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: active === c.key ? 'var(--accent-bg)' : 'transparent',
              color: active === c.key ? 'var(--accent)' : 'var(--text-h)',
              fontWeight: active === c.key ? 600 : 500,
              cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <Active />
    </div>
  )
}
