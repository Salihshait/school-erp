import React from 'react'
import { useTodaysBirthdays } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'
import EmptyState from '../../common/EmptyState'

export default function BirthdaysWidget() {
  const { data, isLoading } = useTodaysBirthdays()
  const students = data || []

  return (
    <PortalCard title="Today's Birthdays">
      {isLoading ? 'Loading...' : students.length === 0 ? (
        <EmptyState>No birthdays today.</EmptyState>
      ) : students.map(s => (
        <div key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
          {s.first_name} {s.last_name}
        </div>
      ))}
    </PortalCard>
  )
}
