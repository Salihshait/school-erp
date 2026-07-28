import React from 'react'
import { usePayslips, useSalaryStructures } from '../../hooks/usePayroll'
import { generatePayslipPdf } from '../../utils/payslipPdf'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function TeacherSalaryPage() {
  const { teacherId } = useTeacherPortalContext()
  const { data: payslips, isLoading } = usePayslips({ teacher_id: teacherId })
  const { data: structures, isLoading: structuresLoading } = useSalaryStructures({ teacher_id: teacherId })

  return (
    <div>
      <h2>Salary</h2>
      <PortalCard title="Salary Structure">
        {structuresLoading ? 'Loading...' : (structures || []).length === 0 ? (
          <EmptyState>No salary structure on file yet.</EmptyState>
        ) : structures.map(s => (
          <div key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            Basic ₹{s.basic}, HRA ₹{s.hra}, DA ₹{s.da} (effective {s.effective_from})
          </div>
        ))}
      </PortalCard>

      <PortalCard title="Payslips">
        {isLoading ? 'Loading...' : (payslips || []).length === 0 ? (
          <EmptyState>No payslips generated yet.</EmptyState>
        ) : payslips.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{p.month}: Gross ₹{p.gross_salary}, Net ₹{p.net_salary}</span>
            <button onClick={() => generatePayslipPdf(p)}>Download PDF</button>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
