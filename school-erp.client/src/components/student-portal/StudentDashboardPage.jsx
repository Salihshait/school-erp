import React from 'react'
import { usePersonAttendance } from '../../hooks/useAttendance'
import { useAssignments, useSubmissions } from '../../hooks/useStudentPortal'
import { useStudentMarks } from '../../hooks/useExam'
import { usePendingFees } from '../../hooks/useFees'
import { useCurrentIssues } from '../../hooks/useLibrary'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'

function StatTile({ label, value }) {
  return (
    <div style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--text)' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

export default function StudentDashboardPage() {
  const { student, studentId } = useStudentPortalContext()
  const attendance = usePersonAttendance({ person_id: studentId, person_type: 'student' })
  const assignments = useAssignments({ class_id: student?.class_id, section: student?.section })
  const submissions = useSubmissions(studentId)
  const marks = useStudentMarks(studentId)
  const fees = usePendingFees({ student_id: studentId })
  const issues = useCurrentIssues(studentId)

  const records = attendance.data || []
  const presentCount = records.filter(r => r.status === 'present').length
  const attendancePct = records.length ? Math.round((presentCount / records.length) * 100) : null

  const submittedIds = new Set((submissions.data || []).map(s => s.assignment_id))
  const pendingAssignments = (assignments.data || []).filter(a => !submittedIds.has(a.id)).length

  return (
    <div>
      <h2>Dashboard</h2>
      <PortalCard title="Overview">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <StatTile label="Attendance" value={attendance.isLoading ? '—' : attendancePct == null ? 'N/A' : `${attendancePct}%`} />
          <StatTile label="Pending Assignments" value={assignments.isLoading || submissions.isLoading ? '—' : pendingAssignments} />
          <StatTile label="Marks Recorded" value={marks.isLoading ? '—' : (marks.data || []).length} />
          <StatTile label="Pending Fees" value={fees.isLoading ? '—' : (fees.data || []).length} />
          <StatTile label="Books Issued" value={issues.isLoading ? '—' : (issues.data || []).length} />
        </div>
      </PortalCard>
    </div>
  )
}
