import React, { useState } from 'react'
import { useStudents } from '../../hooks/useStudents'
import { useCreateSession, useBulkRecord } from '../../hooks/useAttendance'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

const STATUSES = ['present', 'absent', 'late', 'on_leave', 'excused']
const today = () => new Date().toISOString().slice(0, 10)

export default function TeacherStudentAttendancePage() {
  const { teacherId } = useTeacherPortalContext()
  const [classId, setClassId] = useState('')
  const [section, setSection] = useState('')
  const [date, setDate] = useState(today())
  const [statuses, setStatuses] = useState({})
  const [saved, setSaved] = useState(false)

  const { data: students, isLoading } = useStudents({ filters: { class_id: classId, section } })
  const createSession = useCreateSession()
  const bulkRecord = useBulkRecord()

  const roster = classId ? (students || []) : []

  async function submit() {
    if (!roster.length) return
    const session = await createSession.mutateAsync({ session_date: date, session_type: 'student', created_by: teacherId })
    const records = roster.map(s => ({
      session_id: session.id,
      person_id: s.id,
      person_type: 'student',
      status: statuses[s.id] || 'present',
      recorded_by: teacherId,
    }))
    await bulkRecord.mutateAsync(records)
    setSaved(true)
  }

  return (
    <div>
      <h2>Student Attendance</h2>
      <PortalCard title="Select Class">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Class ID" value={classId} onChange={e => { setClassId(e.target.value); setSaved(false) }} />
          <input placeholder="Section" value={section} onChange={e => { setSection(e.target.value); setSaved(false) }} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </PortalCard>

      {classId && (
        <PortalCard title="Mark Attendance" action={<button onClick={submit} disabled={!roster.length}>Save Attendance</button>}>
          {isLoading ? 'Loading...' : roster.length === 0 ? (
            <EmptyState>No students found for this class/section.</EmptyState>
          ) : roster.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{s.first_name} {s.last_name}</span>
              <select
                value={statuses[s.id] || 'present'}
                onChange={e => setStatuses(st => ({ ...st, [s.id]: e.target.value }))}
              >
                {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          ))}
          {saved && <div style={{ marginTop: 8, fontSize: 13.5 }}>Attendance saved for {date}.</div>}
        </PortalCard>
      )}
    </div>
  )
}
