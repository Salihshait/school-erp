import React, { useState } from 'react'
import { useHostelFees, useCreateHostelFee, useCollectHostelFee } from '../../hooks/useHostel'

export default function HostelFees() {
  const { data, isLoading } = useHostelFees()
  const create = useCreateHostelFee()
  const collect = useCollectHostelFee()
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  async function submit() {
    if (!studentId.trim() || !amount) return
    await create.mutateAsync({ student_id: studentId, amount: Number(amount), due_date: dueDate || null })
    setStudentId('')
    setAmount('')
    setDueDate('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Hostel Fees</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 110 }} />
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <button onClick={submit}>Add Fee</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(f => (
          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>Student {f.student_id} — ₹{f.amount} — due {f.due_date || '—'} — {f.status}</span>
            {f.status !== 'paid' && <button onClick={() => collect.mutate(f.id)}>Mark Paid</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
