import React, { useState } from 'react'
import { useDrivers, useAddDriver } from '../../hooks/useTransport'

export default function Drivers() {
  const { data, isLoading } = useDrivers()
  const add = useAddDriver()
  const [name, setName] = useState('')

  async function submit() {
    await add.mutateAsync({ name })
    setName('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Drivers</h4>
      <div>
        <input placeholder="Driver name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={submit}>Add Driver</button>
      </div>
      <div>
        {isLoading ? 'Loading...' : data?.map(d => <div key={d.id}>{d.name} — {d.license_no}</div>)}
      </div>
    </div>
  )
}
