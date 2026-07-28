import React, { useState } from 'react'
import { useLoans, useCreateLoan, useCloseLoan, useRecordLoanRepayment } from '../../hooks/usePayroll'

export default function Loan() {
  const { data, isLoading } = useLoans()
  const create = useCreateLoan()
  const close = useCloseLoan()
  const repay = useRecordLoanRepayment()
  const [teacherId, setTeacherId] = useState('')
  const [principal, setPrincipal] = useState('')
  const [tenure, setTenure] = useState('')
  const [installment, setInstallment] = useState('')

  async function submit() {
    if (!teacherId.trim() || !principal) return
    await create.mutateAsync({
      teacher_id: teacherId,
      principal_amount: Number(principal) || 0,
      tenure_months: Number(tenure) || 1,
      monthly_installment: Number(installment) || 0,
    })
    setTeacherId('')
    setPrincipal('')
    setTenure('')
    setInstallment('')
  }

  function recordInstallment(loan) {
    repay.mutate({ loan_id: loan.id, teacher_id: loan.teacher_id, amount: loan.monthly_installment })
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Loan</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Teacher ID" value={teacherId} onChange={e => setTeacherId(e.target.value)} />
        <input type="number" placeholder="Principal" value={principal} onChange={e => setPrincipal(e.target.value)} style={{ width: 110 }} />
        <input type="number" placeholder="Tenure (months)" value={tenure} onChange={e => setTenure(e.target.value)} style={{ width: 130 }} />
        <input type="number" placeholder="Monthly installment" value={installment} onChange={e => setInstallment(e.target.value)} style={{ width: 150 }} />
        <button onClick={submit}>Add Loan</button>
      </div>
      <div style={{ marginTop: 8 }}>
        {isLoading ? 'Loading...' : (data || []).map(l => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span>Teacher {l.teacher_id} — ₹{l.principal_amount} over {l.tenure_months}mo (₹{l.monthly_installment}/mo) — {l.status}</span>
            {l.status === 'active' && (
              <span style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => recordInstallment(l)}>Record Repayment</button>
                <button onClick={() => close.mutate(l.id)}>Close</button>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
