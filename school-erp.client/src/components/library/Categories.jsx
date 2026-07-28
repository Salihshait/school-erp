import React, { useState } from 'react'
import { useCreateBook } from '../../hooks/useLibrary'

export default function Categories() {
  const [name, setName] = useState('')
  // reuse createBook for demo; ideally createCategory hook
  const create = useCreateBook()

  async function submit() {
    // demo placeholder: create book as category placeholder
    await create.mutateAsync({ title: `Category: ${name}` })
    setName('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Categories</h4>
      <div>
        <input placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={submit}>Add (demo)</button>
      </div>
    </div>
  )
}
