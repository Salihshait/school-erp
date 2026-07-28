import React, { useState } from 'react'
import { useExams, useEnterMarks } from '../../hooks/useExam'
import PortalCard from '../common/PortalCard'

export default function TeacherExamMarksPage() {
  const { data: exams, isLoading: examsLoading } = useExams()
  const [examId, setExamId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [marks, setMarks] = useState('')
  const [maxMarks, setMaxMarks] = useState('100')
  const enterMarks = useEnterMarks()
  const [saved, setSaved] = useState(false)

  async function submit() {
    if (!examId || !studentId.trim() || !subjectId.trim() || !marks) return
    await enterMarks.mutateAsync({
      exam_id: examId,
      student_id: studentId,
      subject_id: subjectId,
      marks_obtained: Number(marks),
      max_marks: Number(maxMarks) || 100,
    })
    setStudentId('')
    setSubjectId('')
    setMarks('')
    setSaved(true)
  }

  return (
    <div>
      <h2>Exam Marks</h2>
      <PortalCard title="Enter Marks">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <select value={examId} onChange={e => { setExamId(e.target.value); setSaved(false) }} style={{ padding: 8 }}>
            <option value="">{examsLoading ? 'Loading exams...' : 'Select an exam'}</option>
            {(exams || []).map(e => <option key={e.id} value={e.id}>{e.name || e.id}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
            <input placeholder="Subject ID" value={subjectId} onChange={e => setSubjectId(e.target.value)} />
            <input type="number" placeholder="Marks obtained" value={marks} onChange={e => setMarks(e.target.value)} style={{ width: 140 }} />
            <input type="number" placeholder="Max marks" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} style={{ width: 110 }} />
          </div>
          <button onClick={submit} disabled={!examId}>Submit Marks</button>
          {saved && <div style={{ fontSize: 13.5 }}>Marks saved.</div>}
        </div>
      </PortalCard>
    </div>
  )
}
