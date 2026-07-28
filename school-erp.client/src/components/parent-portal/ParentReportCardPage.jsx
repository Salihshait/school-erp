import React, { useRef, useState } from 'react'
import { useExams, useProgressCard } from '../../hooks/useExam'
import { useParentPortalContext } from './ParentPortalContext'
import { exportElementToPdf } from '../../utils/report'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function ParentReportCardPage() {
  const { studentId, student } = useParentPortalContext()
  const { data: exams, isLoading: examsLoading } = useExams()
  const [examId, setExamId] = useState('')
  const { data: rows, isLoading: cardLoading } = useProgressCard(studentId, examId)
  const printRef = useRef(null)

  async function download() {
    if (!printRef.current) return
    await exportElementToPdf(printRef.current, `report-card-${studentId}.pdf`)
  }

  return (
    <div>
      <h2>Report Card</h2>
      <PortalCard title="Select Exam">
        <select value={examId} onChange={e => setExamId(e.target.value)} style={{ width: '100%', padding: 8 }}>
          <option value="">{examsLoading ? 'Loading exams...' : 'Select an exam'}</option>
          {(exams || []).map(e => <option key={e.id} value={e.id}>{e.name || e.id}</option>)}
        </select>
      </PortalCard>

      {examId && (
        <PortalCard
          title="Report Card"
          action={<button onClick={download} disabled={!rows?.length}>Download PDF</button>}
        >
          <div ref={printRef} style={{ padding: 8 }}>
            <h3 style={{ marginTop: 0 }}>{student ? `${student.first_name} ${student.last_name}` : 'Student'}</h3>
            {cardLoading ? 'Loading...' : !rows?.length ? (
              <EmptyState>No report card published for this exam yet.</EmptyState>
            ) : rows.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Subject {r.subject_id}</span>
                <span>{r.marks_obtained ?? r.grade}</span>
              </div>
            ))}
          </div>
        </PortalCard>
      )}
    </div>
  )
}
