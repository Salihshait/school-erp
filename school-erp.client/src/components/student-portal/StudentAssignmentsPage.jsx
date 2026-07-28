import React, { useState } from 'react'
import { useAssignments, useSubmissions, useSubmitAssignment } from '../../hooks/useStudentPortal'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function StudentAssignmentsPage() {
  const { student, studentId } = useStudentPortalContext()
  const { data: assignments, isLoading } = useAssignments({ class_id: student?.class_id, section: student?.section })
  const { data: submissions } = useSubmissions(studentId)
  const submit = useSubmitAssignment()
  const [drafts, setDrafts] = useState({})

  const submissionByAssignment = new Map((submissions || []).map(s => [s.assignment_id, s]))

  async function handleSubmit(assignmentId) {
    const content = drafts[assignmentId]
    if (!content?.trim()) return
    await submit.mutateAsync({ assignment_id: assignmentId, student_id: studentId, content })
    setDrafts(d => ({ ...d, [assignmentId]: '' }))
  }

  return (
    <div>
      <h2>Assignments</h2>
      <PortalCard title="Your Assignments">
        {isLoading ? 'Loading...' : (assignments || []).length === 0 ? (
          <EmptyState>No assignments posted yet.</EmptyState>
        ) : assignments.map(a => {
          const submission = submissionByAssignment.get(a.id)
          return (
            <div key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600 }}>{a.subject}: {a.title}</div>
              {a.description && <div style={{ fontSize: 13.5 }}>{a.description}</div>}
              <div style={{ fontSize: 12.5, color: 'var(--text)', marginBottom: 6 }}>
                Due: {a.due_date || '—'}{a.max_marks ? ` • Max marks: ${a.max_marks}` : ''}
              </div>
              {submission ? (
                <div style={{ fontSize: 13.5 }}>
                  Submitted{submission.status === 'graded' ? ` — Marks: ${submission.marks_obtained}` : ' — awaiting grading'}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    placeholder="Your answer or submission link"
                    value={drafts[a.id] || ''}
                    onChange={e => setDrafts(d => ({ ...d, [a.id]: e.target.value }))}
                    style={{ flex: 1, padding: 8 }}
                  />
                  <button onClick={() => handleSubmit(a.id)}>Submit</button>
                </div>
              )}
            </div>
          )
        })}
      </PortalCard>
    </div>
  )
}
