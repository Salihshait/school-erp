import React from 'react'
import { useAdmissionsMonthly, useExamPerformance, useBookIssueSummary, useTeacherPerformanceSummary } from '../../hooks/useReports'
import { useAttendanceOverview } from '../../hooks/useAttendance'
import { useMonthlyCollections } from '../../hooks/useFees'
import { usePayrollSummary } from '../../hooks/usePayroll'
import { useVehicleUtilization } from '../../hooks/useTransport'
import { useRoomOccupancy } from '../../hooks/useHostel'
import { useClassResultSummary } from '../../hooks/useExam'

function sum(rows, key) {
  return (rows || []).reduce((total, row) => total + (Number(row[key]) || 0), 0)
}

function StatTile({ label, value }) {
  return (
    <div style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--text)' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

export default function ReportsDashboard() {
  const admissions = useAdmissionsMonthly()
  const attendance = useAttendanceOverview({ person_type: 'student' })
  const fees = useMonthlyCollections()
  const exams = useExamPerformance()
  const library = useBookIssueSummary()
  const payroll = usePayrollSummary()
  const transport = useVehicleUtilization()
  const hostel = useRoomOccupancy()
  const studentPerformance = useClassResultSummary()
  const teacherPerformance = useTeacherPerformanceSummary()

  const totalAdmissions = sum(admissions.data, 'count')
  const totalPresent = sum(attendance.data, 'present_count')
  const totalAttendanceRecords = totalPresent + sum(attendance.data, 'absent_count')
  const attendancePct = totalAttendanceRecords ? Math.round((totalPresent / totalAttendanceRecords) * 100) : null
  const totalFees = sum(fees.data, 'total')
  const totalExamEntries = sum(exams.data, 'total_entries')
  const totalPass = sum(exams.data, 'pass_count')
  const passRate = totalExamEntries ? Math.round((totalPass / totalExamEntries) * 100) : null
  const totalIssues = sum(library.data, 'total_issues')
  const latestPayroll = (payroll.data || [])[payroll.data?.length - 1]
  const totalAllocations = sum(transport.data, 'allocations')
  const totalOccupied = sum(hostel.data, 'occupied_beds')
  const reviewedTeachers = (teacherPerformance.data || []).filter(t => t.reviews_count > 0)
  const avgTeacherScore = reviewedTeachers.length ? (sum(reviewedTeachers, 'avg_score') / reviewedTeachers.length).toFixed(1) : null

  return (
    <div>
      <h2>Reports Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        <StatTile label="Admissions" value={admissions.isLoading ? '—' : totalAdmissions} />
        <StatTile label="Student Attendance" value={attendance.isLoading ? '—' : attendancePct == null ? 'N/A' : `${attendancePct}%`} />
        <StatTile label="Fees Collected" value={fees.isLoading ? '—' : `₹${totalFees}`} />
        <StatTile label="Exam Pass Rate" value={exams.isLoading ? '—' : passRate == null ? 'N/A' : `${passRate}%`} />
        <StatTile label="Books Issued" value={library.isLoading ? '—' : totalIssues} />
        <StatTile label="Latest Payroll Net" value={payroll.isLoading ? '—' : latestPayroll ? `₹${latestPayroll.total_net}` : 'N/A'} />
        <StatTile label="Vehicle Allocations" value={transport.isLoading ? '—' : totalAllocations} />
        <StatTile label="Hostel Beds Occupied" value={hostel.isLoading ? '—' : totalOccupied} />
        <StatTile label="Students Assessed" value={studentPerformance.isLoading ? '—' : (studentPerformance.data || []).length} />
        <StatTile label="Avg Teacher Score" value={teacherPerformance.isLoading ? '—' : avgTeacherScore ?? 'N/A'} />
      </div>
    </div>
  )
}
