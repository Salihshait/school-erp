import React, { useState } from 'react'
import { useEnterMarks } from '../../hooks/useExam'

export default function MarksEntry() {
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [marks, setMarks] = useState('')
  const enter = useEnterMarks()

  async function submit() {
    await enter.mutateAsync({ exam_id: 'demo-exam', student_id: studentId, subject_id: subjectId, marks_obtained: parseFloat(marks), max_marks: 100 })
    setStudentId('')
    setSubjectId('')
    setMarks('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Marks Entry</h4>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <input placeholder="Subject ID" value={subjectId} onChange={e => setSubjectId(e.target.value)} />
        <input placeholder="Marks" value={marks} onChange={e => setMarks(e.target.value)} />
      </div>
      <button onClick={submit}>Submit Marks</button>
    </div>
  )
}
