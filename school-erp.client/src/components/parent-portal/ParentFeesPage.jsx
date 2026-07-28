import React from 'react'
import { usePendingFees, usePayFee } from '../../hooks/useFees'
import { useParentPortalContext } from './ParentPortalContext'
import PortalCard from './PortalCard'
import EmptyState from './EmptyState'

export default function ParentFeesPage() {
  const { studentId } = useParentPortalContext()
  const { data, isLoading } = usePendingFees({ student_id: studentId })
  const payFee = usePayFee()
  const fees = data || []

  return (
    <div>
      <h2>Fee Payment</h2>
      <PortalCard title="Pending Fees">
        {isLoading ? 'Loading...' : fees.length === 0 ? (
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
    </div>
  )
}
