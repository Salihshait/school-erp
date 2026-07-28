import React from 'react'
import { useTodayAttendanceSummary } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'

export default function TodayAttendanceWidget() {
  const { data, isLoading } = useTodayAttendanceSummary()

  return (
    <PortalCard title="Today's Attendance">
      {isLoading ? 'Loading...' : !data || data.total === 0 ? (
        <div style={{ color: 'var(--text)', fontSize: 14 }}>No attendance marked yet today.</div>
      ) : (
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#16a34a' }}>{data.present}</div>
            <div style={{ fontSize: 12, color: 'var(--text)' }}>Present</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#dc2626' }}>{data.absent}</div>
            <div style={{ fontSize: 12, color: 'var(--text)' }}>Absent</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-h)' }}>{data.total}</div>
            <div style={{ fontSize: 12, color: 'var(--text)' }}>Total</div>
          </div>
        </div>
      )}
    </PortalCard>
  )
}
