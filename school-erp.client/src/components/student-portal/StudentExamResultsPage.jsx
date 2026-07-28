import React from 'react'
import { useStudentMarks } from '../../hooks/useExam'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function StudentExamResultsPage() {
  const { studentId } = useStudentPortalContext()
  const { data, isLoading } = useStudentMarks(studentId)
  const marks = data || []

  return (
    <div>
      <h2>Exam Results</h2>
      <PortalCard title="Marks">
        {isLoading ? 'Loading...' : marks.length === 0 ? (
          <EmptyState>No results published yet.</EmptyState>
        ) : marks.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>Subject {m.subject_id}</span>
            <span>{m.marks_obtained} / {m.max_marks}</span>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
