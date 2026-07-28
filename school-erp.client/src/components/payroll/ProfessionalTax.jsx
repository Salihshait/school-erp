import React, { useState } from 'react'
import { useProfessionalTax, useUpsertProfessionalTax } from '../../hooks/usePayroll'

const currentMonth = () => new Date().toISOString().slice(0, 7) + '-01'

export default function ProfessionalTax() {
  const { data, isLoading } = useProfessionalTax()
  const upsert = useUpsertProfessionalTax()
  const [teacherId, setTeacherId] = useState('')
  const [month, setMonth] = useState(currentMonth())
  const [amount, setAmount] = useState('')

  async function submit() {
    if (!teacherId.trim()) return
    await upsert.mutateAsync({ teacher_id: teacherId, month, amount: Number(amount) || 0 })
    setAmount('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Professional Tax</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <input type="month" value={month.slice(0, 7)} onChange={e => setMonth(e.target.value + '-01')} />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 100 }} />
        <button onClick={submit}>Save PT</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(p => (
          <div key={p.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
            Teacher {p.teacher_id} — {p.month}: ₹{p.amount}
          </div>
        ))}
      </div>
    </div>
  )
}
