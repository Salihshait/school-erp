import React from 'react'
import { useCurrentIssues } from '../../hooks/useLibrary'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function StudentLibraryPage() {
  const { studentId } = useStudentPortalContext()
  const { data, isLoading } = useCurrentIssues(studentId)
  const issues = data || []

  return (
    <div>
      <h2>Library</h2>
      <PortalCard title="Currently Issued Books">
        {isLoading ? 'Loading...' : issues.length === 0 ? (
          <EmptyState>No books currently issued.</EmptyState>
        ) : issues.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{i.title} (copy #{i.copy_no})</span>
            <span style={{ textTransform: 'capitalize' }}>{i.status} — due {i.due_date}</span>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
