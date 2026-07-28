import React, { useState } from 'react'
import { useExamSchedule } from '../../hooks/useExam'

export default function Schedule() {
  const [examId, setExamId] = useState('')
  const schedule = useExamSchedule(examId)

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Exam Schedule</h4>
      <div>
        <input placeholder="Exam ID" value={examId} onChange={e => setExamId(e.target.value)} />
      </div>
      <div>
        {schedule.isLoading ? 'Loading...' : schedule.data?.map(s => <div key={s.id}>{s.subject_id} — {s.start_time} to {s.end_time}</div>)}
      </div>
    </div>
  )
}
