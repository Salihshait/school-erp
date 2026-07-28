import React, { useState } from 'react'
import { useSalaryStructures, useCreateSalaryStructure } from '../../hooks/usePayroll'

const today = () => new Date().toISOString().slice(0, 10)

export default function SalaryStructure() {
  const { data, isLoading } = useSalaryStructures()
  const create = useCreateSalaryStructure()
  const [teacherId, setTeacherId] = useState('')
  const [basic, setBasic] = useState('')
  const [hra, setHra] = useState('')
  const [da, setDa] = useState('')

  async function submit() {
    if (!teacherId.trim() || !basic) return
    await create.mutateAsync({
      teacher_id: teacherId,
      basic: Number(basic) || 0,
      hra: Number(hra) || 0,
      da: Number(da) || 0,
      effective_from: today(),
    })
    setTeacherId('')
    setBasic('')
    setHra('')
    setDa('')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Salary Structure</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <input type="number" placeholder="Basic" value={basic} onChange={e => setBasic(e.target.value)} style={{ width: 100 }} />
        <input type="number" placeholder="HRA" value={hra} onChange={e => setHra(e.target.value)} style={{ width: 90 }} />
        <input type="number" placeholder="DA" value={da} onChange={e => setDa(e.target.value)} style={{ width: 90 }} />
        <button onClick={submit}>Save Structure</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(s => (
          <div key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
            Teacher {s.teacher_id} — Basic ₹{s.basic}, HRA ₹{s.hra}, DA ₹{s.da} (from {s.effective_from})
          </div>
        ))}
      </div>
    </div>
  )
}
