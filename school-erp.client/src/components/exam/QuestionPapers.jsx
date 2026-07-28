import React, { useState } from 'react'
import { useAddQuestion, useCreateExam } from '../../hooks/useExam'

export default function QuestionPapers() {
  const [examTitle, setExamTitle] = useState('')
  const createExam = useCreateExam()
  const addQuestion = useAddQuestion()

  async function create() {
    await createExam.mutateAsync({ title: examTitle })
    setExamTitle('')
  }

  async function addQ() {
    await addQuestion.mutateAsync({ exam_id: 'demo', question_text: 'Sample Q', max_marks: 10, question_type: 'descriptive' })
    alert('Question added (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Question Papers</h4>
      <div>
        <input placeholder="Exam title" value={examTitle} onChange={e => setExamTitle(e.target.value)} />
        <button onClick={create}>Create Exam</button>
        <button style={{ marginLeft: 8 }} onClick={addQ}>Add Question (demo)</button>
      </div>
    </div>
  )
}
