import React, { useMemo } from 'react'
import { TopBar } from './components/TopBar'
import StatCard from './components/StatCard'
import RecentActivity from './components/RecentActivity'
import TodayAttendanceWidget from './components/TodayAttendanceWidget'
import BirthdaysWidget from './components/BirthdaysWidget'
import RecentAdmissionsWidget from './components/RecentAdmissionsWidget'
import RecentNoticesWidget from './components/RecentNoticesWidget'
import FinanceWidget from './components/FinanceWidget'
import CalendarWidget from './components/CalendarWidget'
import DashboardCharts from './components/DashboardCharts'
import NotificationsWidget from './components/NotificationsWidget'
import QuickActionsWidget from './components/QuickActionsWidget'
import { useStudentCount, useTeacherCount, useClassCount, useRecentAdmissions, useRecentNotices } from '../../hooks/useDashboard'
import './AdminDashboard.css'

export default function DashboardPage() {
  const studentCount = useStudentCount()
  const teacherCount = useTeacherCount()
  const classCount = useClassCount()
  const admissions = useRecentAdmissions(5)
  const notices = useRecentNotices(5)

  const activities = useMemo(() => {
    const admissionItems = (admissions.data || []).map(a => ({
      id: `admission-${a.id}`,
      text: `New admission: ${a.student_name}`,
      at: a.admission_date,
    }))
    const noticeItems = (notices.data || []).map(n => ({
      id: `notice-${n.id}`,
      text: `Notice posted: ${n.title}`,
      at: n.posted_at,
    }))
    return [...admissionItems, ...noticeItems]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 8)
  }, [admissions.data, notices.data])

  return (
    <div style={{ padding: 20 }}>
      <TopBar title="Admin Dashboard" />

      <div className="dashboard-stats-row">
        <StatCard title="Total Students" value={studentCount.isLoading ? '—' : studentCount.data ?? 0} />
        <StatCard title="Teachers" value={teacherCount.isLoading ? '—' : teacherCount.data ?? 0} />
        <StatCard title="Classes" value={classCount.isLoading ? '—' : classCount.data ?? 0} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <TodayAttendanceWidget />
      </div>

      <div style={{ marginBottom: 16 }}>
        <DashboardCharts />
      </div>

      <div className="dashboard-columns">
        <div>
          <RecentAdmissionsWidget />
          <RecentNoticesWidget />
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <h4 style={{ margin: '0 0 10px' }}>Recent Activities</h4>
            <RecentActivity activities={activities} loading={admissions.isLoading || notices.isLoading} />
          </div>
          <CalendarWidget />
        </div>

        <aside>
          <FinanceWidget />
          <BirthdaysWidget />
          <NotificationsWidget />
          <QuickActionsWidget />
        </aside>
      </div>
    </div>
  )
}
