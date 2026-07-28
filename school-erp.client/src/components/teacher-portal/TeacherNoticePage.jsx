import React, { useState } from 'react'
import { useNotices, useCreateNotice } from '../../hooks/useParentPortal'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function TeacherNoticePage() {
  const { teacherId } = useTeacherPortalContext()
  const { data, isLoading } = useNotices()
  const create = useCreateNotice()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  async function submit() {
    if (!title.trim() || !body.trim()) return
    await create.mutateAsync({ title, body, audience: 'all', posted_by: teacherId })
    setTitle('')
    setBody('')
  }

  const notices = data || []

  return (
    <div>
      <h2>Notice</h2>
      <PortalCard title="Post a Notice">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: 8 }} />
          <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} rows={3} style={{ padding: 8 }} />
          <button onClick={submit}>Post Notice</button>
        </div>
      </PortalCard>

      <PortalCard title="Notice Board">
        {isLoading ? 'Loading...' : notices.length === 0 ? (
          <EmptyState>No notices posted yet.</EmptyState>
        ) : notices.map(n => (
          <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600 }}>{n.title}</div>
            <div style={{ fontSize: 13.5 }}>{n.body}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{new Date(n.posted_at).toLocaleDateString()}</div>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
