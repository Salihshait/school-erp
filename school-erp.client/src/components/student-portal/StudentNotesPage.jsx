import React from 'react'
import { useStudyNotes } from '../../hooks/useStudentPortal'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function StudentNotesPage() {
  const { student } = useStudentPortalContext()
  const { data, isLoading } = useStudyNotes({ class_id: student?.class_id, section: student?.section })
  const notes = data || []

  return (
    <div>
      <h2>Download Notes</h2>
      <PortalCard title="Study Materials">
        {isLoading ? 'Loading...' : notes.length === 0 ? (
          <EmptyState>No notes uploaded yet.</EmptyState>
        ) : notes.map(n => (
          <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{n.subject}: {n.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{new Date(n.uploaded_at).toLocaleDateString()}</div>
            </div>
            {n.file_url && <a href={n.file_url} target="_blank" rel="noreferrer">Download</a>}
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
