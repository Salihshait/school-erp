import React, { useState } from 'react'
import { useAllowances, useCreateAllowance, useDeleteAllowance } from '../../hooks/usePayroll'

const TYPES = ['hra', 'da', 'conveyance', 'medical', 'special', 'other']
const currentMonth = () => new Date().toISOString().slice(0, 7) + '-01'

export default function Allowance() {
  const { data, isLoading } = useAllowances()
  const create = useCreateAllowance()
  const remove = useDeleteAllowance()
  const [teacherId, setTeacherId] = useState('')
  const [type, setType] = useState('other')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState(currentMonth())

  async function submit() {
    if (!teacherId.trim() || !amount) return
    await create.mutateAsync({ teacher_id: teacherId, allowance_type: type, amount: Number(amount) || 0, month })
    setAmount('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Allowance</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value)}>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 100 }} />
        <input type="month" value={month.slice(0, 7)} onChange={e => setMonth(e.target.value + '-01')} />
        <button onClick={submit}>Add Allowance</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(a => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>Teacher {a.teacher_id} — {a.allowance_type}: ₹{a.amount} ({a.month})</span>
            <button onClick={() => remove.mutate(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
