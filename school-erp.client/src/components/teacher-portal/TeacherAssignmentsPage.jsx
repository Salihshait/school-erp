import React, { useState } from 'react'
import { useAssignments, useCreateAssignment, useAssignmentSubmissions, useGradeSubmission } from '../../hooks/useStudentPortal'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function TeacherAssignmentsPage() {
  const { teacherId } = useTeacherPortalContext()
  const [classId, setClassId] = useState('')
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [maxMarks, setMaxMarks] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [drafts, setDrafts] = useState({})

  const { data: assignments, isLoading } = useAssignments({ class_id: classId || undefined, section: section || undefined })
  const create = useCreateAssignment()
  const { data: submissions, isLoading: submissionsLoading } = useAssignmentSubmissions(selectedAssignment)
  const grade = useGradeSubmission()

  async function submit() {
    if (!classId.trim() || !subject.trim() || !title.trim()) return
    await create.mutateAsync({
      class_id: classId,
      section,
      subject,
      title,
      description,
      due_date: dueDate || null,
      max_marks: maxMarks ? Number(maxMarks) : null,
      created_by: teacherId,
    })
    setTitle('')
    setDescription('')
    setDueDate('')
    setMaxMarks('')
  }

  return (
    <div>
      <h2>Assignment Upload</h2>
      <PortalCard title="Create Assignment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input placeholder="Class ID" value={classId} onChange={e => setClassId(e.target.value)} />
            <input placeholder="Section" value={section} onChange={e => setSection(e.target.value)} />
            <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: 8 }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2} style={{ padding: 8 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <input type="number" placeholder="Max marks" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} style={{ width: 120 }} />
          </div>
          <button onClick={submit}>Upload Assignment</button>
        </div>
      </PortalCard>

      <PortalCard title="Your Assignments">
        {!classId ? (
          <EmptyState>Enter a class ID above to view its assignments.</EmptyState>
        ) : isLoading ? 'Loading...' : (assignments || []).length === 0 ? (
          <EmptyState>No assignments created yet for this class.</EmptyState>
        ) : assignments.map(a => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{a.subject}: {a.title} (due {a.due_date || '—'})</span>
            <button onClick={() => setSelectedAssignment(a.id)}>View Submissions</button>
          </div>
        ))}
      </PortalCard>

      {selectedAssignment && (
        <PortalCard title="Submissions">
          {submissionsLoading ? 'Loading...' : (submissions || []).length === 0 ? (
            <EmptyState>No submissions yet.</EmptyState>
          ) : submissions.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div>Student {s.student_id}</div>
                <div style={{ fontSize: 13.5, color: 'var(--text)' }}>{s.content}</div>
              </div>
              {s.status === 'graded' ? (
                <span>Marks: {s.marks_obtained}</span>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="number"
                    placeholder="Marks"
                    value={drafts[s.id] || ''}
                    onChange={e => setDrafts(d => ({ ...d, [s.id]: e.target.value }))}
                    style={{ width: 80 }}
                  />
                  <button onClick={() => grade.mutate({ id: s.id, marks_obtained: Number(drafts[s.id]) || 0 })}>Grade</button>
                </div>
              )}
            </div>
          ))}
        </PortalCard>
      )}
    </div>
  )
}
