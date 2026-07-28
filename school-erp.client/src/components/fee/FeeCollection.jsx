import React, { useState } from 'react'
import { useCreateFee, useRecordPayment } from '../../hooks/useFees'

export default function FeeCollection() {
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const createFee = useCreateFee()
  const recordPayment = useRecordPayment()

  async function create() {
    await createFee.mutateAsync({ student_id: studentId, amount: parseFloat(amount), status: 'pending' })
    setStudentId('')
    setAmount('')
  }

  async function pay() {
    await recordPayment.mutateAsync({ student_id: studentId, amount: parseFloat(amount), method: 'cash' })
    setStudentId('')
    setAmount('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Fee Collection</h4>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={create}>Create Fee</button>
        <button style={{ marginLeft: 8 }} onClick={pay}>Record Payment</button>
      </div>
    </div>
  )
}
