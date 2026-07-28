import React from 'react'
import { usePendingFees } from '../../hooks/useFees'

export default function PendingFees() {
  const pending = usePendingFees()
  return (
    <div style={{ marginTop: 12 }}>
      <h4>Pending Fees</h4>
      {pending.isLoading ? 'Loading...' : pending.data?.map(f => <div key={f.id}>{f.student_id} — {f.amount}</div>)}
    </div>
  )
}
