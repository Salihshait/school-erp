import React, { useState } from 'react'
import { useCategories, useCreateCategory } from '../../hooks/useFees'

export default function FeeCategories() {
  const { data, isLoading } = useCategories()
  const create = useCreateCategory()
  const [name, setName] = useState('')

  async function submit() {
    await create.mutateAsync({ name, description: '' })
    setName('')
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Fee Categories</h3>
      <div>
        <input placeholder="New category" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={submit}>Add</button>
      </div>
      <ul>
        {isLoading ? <li>Loading...</li> : data?.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
    </div>
  )
}
