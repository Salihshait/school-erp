import React from 'react'
import { usePendingFees } from '../../../hooks/useFees'
import { useTodaysBirthdays, useRecentAdmissions } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'
import EmptyState from '../../common/EmptyState'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export default function NotificationsWidget() {
  const pendingFees = usePendingFees()
  const birthdays = useTodaysBirthdays()
  const admissions = useRecentAdmissions(10)

  const isLoading = pendingFees.isLoading || birthdays.isLoading || admissions.isLoading

  const notifications = []
  const pendingCount = (pendingFees.data || []).length
  if (pendingCount > 0) notifications.push(`${pendingCount} pending fee payment${pendingCount === 1 ? '' : 's'}`)

  const birthdayCount = (birthdays.data || []).length
  if (birthdayCount > 0) notifications.push(`${birthdayCount} birthday${birthdayCount === 1 ? '' : 's'} today`)

  const weekAgo = Date.now() - WEEK_MS
  const recentAdmissionsCount = (admissions.data || []).filter(a => new Date(a.admission_date).getTime() >= weekAgo).length
  if (recentAdmissionsCount > 0) notifications.push(`${recentAdmissionsCount} new admission${recentAdmissionsCount === 1 ? '' : 's'} this week`)

  return (
    <PortalCard title="Notifications">
      {isLoading ? 'Loading...' : notifications.length === 0 ? (
        <EmptyState>No new notifications.</EmptyState>
      ) : notifications.map((n, i) => (
        <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>{n}</div>
      ))}
    </PortalCard>
  )
}
