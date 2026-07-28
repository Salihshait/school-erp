import React, { useState } from 'react'
import { useCreateExamType } from '../../hooks/useExam'

export default function ExamTypes() {
  const [name, setName] = useState('')
  const create = useCreateExamType()

  async function submit() {
    await create.mutateAsync({ name, description: '' })
    setName('')
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Exam Types</h3>
      <div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Type name" />
        <button onClick={submit}>Add</button>
      </div>
    </div>
  )
}
