import React, { useEffect, useState } from 'react'
import { TopBar } from './components/TopBar'
import StatCard from './components/StatCard'
import ClassSummary from './components/ClassSummary'
import RecentActivity from './components/RecentActivity'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [classes, setClasses] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        // Fetch consolidated dashboard data from backend endpoints if available
        const [sRes, cRes, aRes] = await Promise.all([
          fetch('/api/dashboard/stats').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/classes').then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('/api/activities').then(r => r.ok ? r.json() : []).catch(() => []),
        ])

        if (!mounted) return
        setStats(sRes || { students: 124, assignmentsDue: 6, averageGrade: 87 })
        setClasses(cRes || [{ id: 'c1', name: 'Math 5A', teacher: 'Ms. Smith', students: 28 }])
        setActivities(aRes || [{ id: 'a1', text: 'Math Quiz 1 graded', at: new Date().toISOString() }])
      } catch (err) {
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <TopBar title="Dashboard" />

      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard title="Students" value={loading ? '—' : stats?.students} />
        <StatCard title="Assignments Due" value={loading ? '—' : stats?.assignmentsDue} />
        <StatCard title="Class Average" value={loading ? '—' : `${stats?.averageGrade ?? '—'}%`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <section style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '8px 0' }}>Classes</h3>
            <ClassSummary classes={classes} loading={loading} />
          </section>

          <section>
            <h3 style={{ margin: '8px 0' }}>Recent Activity</h3>
            <RecentActivity activities={activities} loading={loading} />
          </section>
        </div>

        <aside>
          <section style={{ marginBottom: 12 }}>
            <h4 style={{ margin: '8px 0' }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a className="btn" href="/export" style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', borderRadius: 6, textDecoration: 'none', display: 'inline-block' }}>Run Export</a>
              <a className="btn" href="/settings" style={{ padding: '8px 12px', background: '#6b7280', color: '#fff', borderRadius: 6, textDecoration: 'none', display: 'inline-block' }}>Settings</a>
            </div>
          </section>

          <section>
            <h4 style={{ margin: '8px 0' }}>Notifications</h4>
            <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, minHeight: 80 }}>No new notifications</div>
          </section>
        </aside>
      </div>
    </div>
  )
}
