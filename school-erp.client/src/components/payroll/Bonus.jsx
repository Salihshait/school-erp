import React, { useState } from 'react'
import { useBonuses, useCreateBonus } from '../../hooks/usePayroll'

const TYPES = ['festival', 'performance', 'annual', 'other']
const currentMonth = () => new Date().toISOString().slice(0, 7) + '-01'

export default function Bonus() {
  const { data, isLoading } = useBonuses()
  const create = useCreateBonus()
  const [teacherId, setTeacherId] = useState('')
  const [type, setType] = useState('festival')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState(currentMonth())

  async function submit() {
    if (!teacherId.trim() || !amount) return
    await create.mutateAsync({ teacher_id: teacherId, bonus_type: type, amount: Number(amount) || 0, month })
    setAmount('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Bonus</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value)}>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 100 }} />
        <input type="month" value={month.slice(0, 7)} onChange={e => setMonth(e.target.value + '-01')} />
        <button onClick={submit}>Add Bonus</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(b => (
          <div key={b.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
            Teacher {b.teacher_id} — {b.bonus_type}: ₹{b.amount} ({b.month})
          </div>
        ))}
      </div>
    </div>
  )
}
