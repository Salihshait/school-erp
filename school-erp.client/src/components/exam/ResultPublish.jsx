import React, { useState } from 'react'
import { usePublishResults } from '../../hooks/useExam'

export default function ResultPublish() {
  const [examId, setExamId] = useState('')
  const publish = usePublishResults()

  async function doPublish() {
    await publish.mutateAsync({ exam_id: examId, published_by: 'system', notes: '' })
    alert('Results published (demo)')
    setExamId('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Publish Results</h4>
      <div>
        <input placeholder="Exam ID" value={examId} onChange={e => setExamId(e.target.value)} />
        <button onClick={doPublish}>Publish</button>
      </div>
    </div>
  )
}
