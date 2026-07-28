import React from 'react'

export default function Receipt({ payment }) {
  if (!payment) return <div>No receipt</div>
  return (
    <div style={{ padding: 12, border: '1px solid #ddd', width: 320 }}>
      <h4>Receipt</h4>
      <div>Receipt #: {payment.id}</div>
      <div>Student: {payment.student_id}</div>
      <div>Amount: {payment.amount}</div>
      <div>Method: {payment.method}</div>
      <div>Date: {payment.collected_at}</div>
    </div>
  )
}
