import React, { useState } from 'react'
import { useCreateFee } from '../../hooks/useFees'

export default function Installments() {
  const [feeId, setFeeId] = useState('')
  const [count, setCount] = useState(3)
  const create = useCreateFee()

  async function createInstallments() {
    // For demo: create fee and then installments in service (not implemented fully)
    await create.mutateAsync({ student_id: '00000000-0000-0000-0000-000000000000', amount: 1000, status: 'pending' })
    alert('Installment plan created (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Installments</h4>
      <div>
        <input placeholder="Fee ID" value={feeId} onChange={e => setFeeId(e.target.value)} />
        <input placeholder="Count" type="number" value={count} onChange={e => setCount(e.target.value)} />
      </div>
      <button onClick={createInstallments}>Create Plan</button>
    </div>
  )
}
