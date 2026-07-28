import React, { useState } from 'react'
import { useVehicles, useAddVehicle } from '../../hooks/useTransport'

export default function Vehicles() {
  const { data, isLoading } = useVehicles()
  const add = useAddVehicle()
  const [reg, setReg] = useState('')

  async function submit() {
    await add.mutateAsync({ reg_no: reg })
    setReg('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Vehicles</h4>
      <div>
        <input placeholder="Reg no" value={reg} onChange={e => setReg(e.target.value)} />
        <button onClick={submit}>Add Vehicle</button>
      </div>
      <div>
        {isLoading ? 'Loading...' : data?.map(v => <div key={v.id}>{v.reg_no} — {v.status}</div>)}
      </div>
    </div>
  )
}
