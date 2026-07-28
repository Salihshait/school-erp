import React, { useState } from 'react'
import { usePfContributions, useUpsertPfContribution } from '../../hooks/usePayroll'

const currentMonth = () => new Date().toISOString().slice(0, 7) + '-01'

export default function PF() {
  const { data, isLoading } = usePfContributions()
  const upsert = useUpsertPfContribution()
  const [teacherId, setTeacherId] = useState('')
  const [month, setMonth] = useState(currentMonth())
  const [employee, setEmployee] = useState('')
  const [employer, setEmployer] = useState('')

  async function submit() {
    if (!teacherId.trim()) return
    await upsert.mutateAsync({
      teacher_id: teacherId,
      month,
      employee_contribution: Number(employee) || 0,
      employer_contribution: Number(employer) || 0,
    })
    setEmployee('')
    setEmployer('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Provident Fund (PF)</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <input type="month" value={month.slice(0, 7)} onChange={e => setMonth(e.target.value + '-01')} />
        <input type="number" placeholder="Employee contribution" value={employee} onChange={e => setEmployee(e.target.value)} style={{ width: 160 }} />
        <input type="number" placeholder="Employer contribution" value={employer} onChange={e => setEmployer(e.target.value)} style={{ width: 160 }} />
        <button onClick={submit}>Save PF</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(p => (
          <div key={p.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
            Teacher {p.teacher_id} — {p.month}: Employee ₹{p.employee_contribution}, Employer ₹{p.employer_contribution}
          </div>
        ))}
      </div>
    </div>
  )
}
