import React, { useState } from 'react'
import { useCreateBook, useAddCopy } from '../../hooks/useLibrary'

export default function Books() {
  const [title, setTitle] = useState('')
  const create = useCreateBook()
  const addCopy = useAddCopy()

  async function submit() {
    const b = await create.mutateAsync({ title })
    await addCopy.mutateAsync({ book_id: b.id, copy_no: 1 })
    setTitle('')
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Books</h3>
      <div>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <button onClick={submit}>Add Book + Copy</button>
      </div>
    </div>
  )
}
