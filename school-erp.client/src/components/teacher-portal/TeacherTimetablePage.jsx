import React from 'react'
import { useTeacherTimetable } from '../../hooks/useTeachers'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function TeacherTimetablePage() {
  const { teacherId } = useTeacherPortalContext()
  const { data, isLoading } = useTeacherTimetable(teacherId)
  const entries = data || []

  return (
    <div>
      <h2>Timetable</h2>
      <PortalCard title="Weekly Schedule">
        {isLoading ? 'Loading...' : entries.length === 0 ? (
          <EmptyState>No timetable published yet.</EmptyState>
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
