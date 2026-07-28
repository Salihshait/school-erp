import React from 'react'
import { usePendingFees, usePayFee, usePayments } from '../../hooks/useFees'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function StudentFeesPage() {
  const { studentId } = useStudentPortalContext()
  const { data: fees, isLoading } = usePendingFees({ student_id: studentId })
  const payFee = usePayFee()
  const { data: payments, isLoading: paymentsLoading } = usePayments(studentId)

  return (
    <div>
      <h2>Fees</h2>
      <PortalCard title="Pending Fees">
        {isLoading ? 'Loading...' : (fees || []).length === 0 ? (
          <EmptyState>No pending fees. You're all caught up.</EmptyState>
        ) : fees.map(f => (
          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span>₹{f.amount} — due {f.due_date || '—'}</span>
            <button
              disabled={payFee.isLoading}
              onClick={() => payFee.mutate({ fee_id: f.id, student_id: studentId, amount: f.amount })}
            >
              Pay Now
            </button>
          </div>
        ))}
      </PortalCard>

      <PortalCard title="Payment History">
        {paymentsLoading ? 'Loading...' : (payments || []).length === 0 ? (
          <EmptyState>No payments recorded yet.</EmptyState>
        ) : payments.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>₹{p.amount} via {p.method}</span>
            <span>{new Date(p.collected_at).toLocaleDateString()}</span>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
