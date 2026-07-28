import React from 'react'

function ActivityRow({ item }) {
  return (
    <div style={{ padding: 10, borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ fontSize: 14 }}>{item.text}</div>
      <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(item.at).toLocaleString()}</div>
    </div>
  )
}

export default function RecentActivity({ activities = [], loading = false }) {
  if (loading) return <div>Loading activity...</div>
  if (!activities || activities.length === 0) return <div>No recent activity</div>

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      {activities.map(a => <ActivityRow key={a.id} item={a} />)}
    </div>
  )
}
