import React from 'react'
import { usePayments } from '../../hooks/useFees'

export default function PaymentHistory() {
  const payments = usePayments()
  return (
    <div style={{ marginTop: 12 }}>
      <h4>Payment History</h4>
      <div>
        {payments.isLoading ? 'Loading...' : payments.data?.map(p => (
          <div key={p.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            {p.student_id} — {p.amount} — {p.method}
          </div>
        ))}
      </div>
    </div>
  )
}
