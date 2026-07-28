import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ReportsPage from '../ReportsPage'

vi.mock('../ReportsDashboard', () => ({ default: () => <div>DASHBOARD VIEW</div> }))
vi.mock('../AdmissionsReport', () => ({ default: () => <div>ADMISSIONS VIEW</div> }))
vi.mock('../AttendanceReport', () => ({ default: () => <div>ATTENDANCE VIEW</div> }))
vi.mock('../FeesReport', () => ({ default: () => <div>FEES VIEW</div> }))
vi.mock('../ExamsReport', () => ({ default: () => <div>EXAMS VIEW</div> }))
vi.mock('../LibraryReport', () => ({ default: () => <div>LIBRARY VIEW</div> }))
vi.mock('../PayrollReport', () => ({ default: () => <div>PAYROLL VIEW</div> }))
vi.mock('../TransportReport', () => ({ default: () => <div>TRANSPORT VIEW</div> }))
vi.mock('../HostelReport', () => ({ default: () => <div>HOSTEL VIEW</div> }))
vi.mock('../StudentPerformanceReport', () => ({ default: () => <div>STUDENT PERFORMANCE VIEW</div> }))
vi.mock('../TeacherPerformanceReport', () => ({ default: () => <div>TEACHER PERFORMANCE VIEW</div> }))

describe('ReportsPage', () => {
  it('shows the Dashboard by default', () => {
    render(<ReportsPage />)
    expect(screen.getByText('DASHBOARD VIEW')).toBeInTheDocument()
  })

  it('switches to the selected report category', () => {
    render(<ReportsPage />)
    fireEvent.click(screen.getByText('Hostel'))
    expect(screen.getByText('HOSTEL VIEW')).toBeInTheDocument()
    expect(screen.queryByText('DASHBOARD VIEW')).not.toBeInTheDocument()
  })

  it('renders a tab for every report category', () => {
    render(<ReportsPage />)
    ;['Admissions', 'Attendance', 'Fees', 'Exams', 'Library', 'Payroll', 'Transport', 'Hostel', 'Student Performance', 'Teacher Performance'].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })
})
