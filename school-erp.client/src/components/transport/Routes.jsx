import React, { useState } from 'react'
import { useRoutes, useCreateRoute } from '../../hooks/useTransport'

export default function Routes() {
  const { data, isLoading } = useRoutes()
  const create = useCreateRoute()
  const [name, setName] = useState('')

  async function submit() {
    await create.mutateAsync({ name })
    setName('')
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Routes</h3>
      <div>
        <input placeholder="Route name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={submit}>Add Route</button>
      </div>
      <ul>
        {isLoading ? <li>Loading...</li> : data?.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  )
}
