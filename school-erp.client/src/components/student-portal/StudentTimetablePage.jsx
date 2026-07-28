import React from 'react'
import { useClassTimetable } from '../../hooks/useTeachers'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StudentTimetablePage() {
  const { student } = useStudentPortalContext()
  const { data, isLoading } = useClassTimetable(student?.class_id)
  const entries = data || []

  return (
    <div>
      <h2>Timetable</h2>
      <PortalCard title="Weekly Schedule">
        {isLoading ? 'Loading...' : entries.length === 0 ? (
          <EmptyState>No timetable published for your class yet.</EmptyState>
        ) : entries.map(e => (
          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{DAY_NAMES[e.day_of_week] ?? e.day_of_week} • {e.start_time}–{e.end_time}</span>
            <span>{e.subject}{e.location ? ` (${e.location})` : ''}</span>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
