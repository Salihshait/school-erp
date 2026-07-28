import React, { useState } from 'react'
import { useCreateSession, useRecordAttendance, useSessionRecords } from '../../hooks/useAttendance'

export default function DailyAttendance() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const create = useCreateSession()
  const [sessionId, setSessionId] = useState(null)
  const records = useSessionRecords(sessionId)
  const record = useRecordAttendance()

  async function startSession() {
    const s = await create.mutateAsync({ session_date: date, session_type: 'student' })
    setSessionId(s.id)
  }

  async function markPresent(personId) {
    await record.mutateAsync({ session_id: sessionId, person_id: personId, person_type: 'student', status: 'present' })
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Daily Attendance</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={startSession}>Start Session</button>
      </div>
      {sessionId && (
        <div style={{ marginTop: 8 }}>
          <div>Session: {sessionId}</div>
          <button onClick={() => markPresent('00000000-0000-0000-0000-000000000000')}>Mark demo student present</button>
          <div>
            {records.isLoading ? 'Loading...' : records.data?.map(r => <div key={r.id}>{r.person_id} — {r.status}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}
