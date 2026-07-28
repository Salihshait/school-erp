import React, { useState } from 'react'
import { usePayslips, useGeneratePayslip } from '../../hooks/usePayroll'
import { generatePayslipPdf } from '../../utils/payslipPdf'

const currentMonth = () => new Date().toISOString().slice(0, 7) + '-01'

export default function Payslip() {
  const { data, isLoading } = usePayslips()
  const generate = useGeneratePayslip()
  const [teacherId, setTeacherId] = useState('')
  const [month, setMonth] = useState(currentMonth())

  async function submit() {
    if (!teacherId.trim()) return
    await generate.mutateAsync({ teacher_id: teacherId, month })
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Payslip</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <input type="month" value={month.slice(0, 7)} onChange={e => setMonth(e.target.value + '-01')} />
        <button onClick={submit}>Generate Payslip</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>Teacher {p.teacher_id} — {p.month}: Gross ₹{p.gross_salary}, Net ₹{p.net_salary} — {p.status}</span>
            <button onClick={() => generatePayslipPdf(p)}>Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  )
}
