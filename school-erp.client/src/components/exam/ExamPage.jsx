import React from 'react'
import ExamTypes from './ExamTypes'
import QuestionPapers from './QuestionPapers'
import MarksEntry from './MarksEntry'
import Schedule from './Schedule'
import ResultPublish from './ResultPublish'
import ProgressCard from './ProgressCard'

export default function ExamPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Examinations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <ExamTypes />
          <QuestionPapers />
          <MarksEntry />
        </div>
        <div>
          <Schedule />
          <ResultPublish />
          <ProgressCard />
        </div>
      </div>
    </div>
  )
}
