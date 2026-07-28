import React, { useState } from 'react'
import { useAdvanceSalaries, useRequestAdvanceSalary, useUpdateAdvanceSalaryStatus } from '../../hooks/usePayroll'

export default function AdvanceSalary() {
  const { data, isLoading } = useAdvanceSalaries()
  const request = useRequestAdvanceSalary()
  const updateStatus = useUpdateAdvanceSalaryStatus()
  const [teacherId, setTeacherId] = useState('')
  const [amount, setAmount] = useState('')

  async function submit() {
    if (!teacherId.trim() || !amount) return
    await request.mutateAsync({ teacher_id: teacherId, amount: Number(amount) || 0 })
    setTeacherId('')
    setAmount('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Advance Salary</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 100 }} />
        <button onClick={submit}>Request Advance</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(a => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>Teacher {a.teacher_id} — ₹{a.amount} — {a.status}</span>
            <select value={a.status} onChange={e => updateStatus.mutate({ id: a.id, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
