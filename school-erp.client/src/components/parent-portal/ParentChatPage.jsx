import React, { useState } from 'react'
import { useTeachers } from '../../hooks/useTeachers'
import { useMessages, useSendMessage } from '../../hooks/useParentPortal'
import { useParentPortalContext } from './ParentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function ParentChatPage() {
  const { studentId } = useParentPortalContext()
  const { data: teachers } = useTeachers({ page: 1, perPage: 100 })
  const [teacherId, setTeacherId] = useState('')
  const { data: messages, isLoading } = useMessages({ student_id: studentId, teacher_id: teacherId })
  const send = useSendMessage()
  const [body, setBody] = useState('')

  async function submit() {
    if (!body.trim() || !teacherId) return
    await send.mutateAsync({ student_id: studentId, teacher_id: teacherId, sender_type: 'parent', body })
    setBody('')
  }

  return (
    <div>
      <h2>Teacher Chat</h2>
      <PortalCard title="Select Teacher">
        <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={{ width: '100%', padding: 8 }}>
          <option value="">Select a teacher</option>
          {(teachers || []).map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
        </select>
      </PortalCard>

      {teacherId && (
        <PortalCard title="Conversation">
          <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 10 }}>
            {isLoading ? 'Loading...' : !messages?.length ? (
              <EmptyState>No messages yet. Say hello!</EmptyState>
            ) : messages.map(m => (
              <div key={m.id} style={{
                textAlign: m.sender_type === 'parent' ? 'right' : 'left',
                margin: '6px 0',
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 10px',
                  borderRadius: 12,
                  background: m.sender_type === 'parent' ? 'var(--accent-bg)' : 'var(--social-bg)',
                  fontSize: 13.5,
                  maxWidth: '80%',
                }}>
                  {m.body}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Type a message..."
              value={body}
              onChange={e => setBody(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={submit}>Send</button>
          </div>
        </PortalCard>
      )}
    </div>
  )
}
