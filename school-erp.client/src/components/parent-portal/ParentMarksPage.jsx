import React from 'react'
import { useStudentMarks } from '../../hooks/useExam'
import { useParentPortalContext } from './ParentPortalContext'
import PortalCard from './PortalCard'
import EmptyState from './EmptyState'

export default function ParentMarksPage() {
  const { studentId } = useParentPortalContext()
  const { data, isLoading } = useStudentMarks(studentId)
  const marks = data || []

  return (
    <div>
      <h2>Marks</h2>
      <PortalCard title="Exam Marks">
        {isLoading ? 'Loading...' : marks.length === 0 ? (
          <EmptyState>No marks published yet.</EmptyState>
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
