import React from 'react'
import { useProgressCard } from '../../hooks/useExam'

export default function ProgressCard({ studentId = '', examId = '' }) {
  const progress = useProgressCard(studentId, examId)
  return (
    <div style={{ marginTop: 12 }}>
      <h4>Progress Card</h4>
      {progress.isLoading ? 'Loading...' : <div>{JSON.stringify(progress.data)}</div>}
    </div>
  )
}
