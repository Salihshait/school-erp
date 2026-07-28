import React, { useState } from 'react'
import { useHomework, useCreateHomework } from '../../hooks/useParentPortal'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function TeacherHomeworkPage() {
  const { teacherId } = useTeacherPortalContext()
  const [classId, setClassId] = useState('')
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const { data, isLoading } = useHomework({ class_id: classId || undefined, section: section || undefined })
  const create = useCreateHomework()

  async function submit() {
    if (!classId.trim() || !subject.trim() || !title.trim()) return
    await create.mutateAsync({
      class_id: classId,
      section,
      subject,
      title,
      description,
      due_date: dueDate || null,
      created_by: teacherId,
    })
    setTitle('')
    setDescription('')
    setDueDate('')
  }

  return (
    <div>
      <h2>Homework</h2>
      <PortalCard title="Post Homework">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input placeholder="Class ID" value={classId} onChange={e => setClassId(e.target.value)} />
            <input placeholder="Section" value={section} onChange={e => setSection(e.target.value)} />
            <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: 8 }} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2} style={{ padding: 8 }} />
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <button onClick={submit}>Post Homework</button>
        </div>
      </PortalCard>

      <PortalCard title="Posted Homework">
        {!classId ? (
          <EmptyState>Enter a class ID above to view its homework.</EmptyState>
        ) : isLoading ? 'Loading...' : (data || []).length === 0 ? (
          <EmptyState>No homework posted yet for this class.</EmptyState>
        ) : data.map(h => (
          <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{h.subject}: {h.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text)' }}>Due: {h.due_date || '—'}</div>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
