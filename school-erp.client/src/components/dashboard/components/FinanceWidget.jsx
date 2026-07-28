import React, { useState } from 'react'
import { useMonthlyFinance, useExpenses, useCreateExpense } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'

const CATEGORIES = ['salary', 'maintenance', 'utilities', 'supplies', 'transport', 'other']

export default function FinanceWidget() {
  const { data: finance, isLoading } = useMonthlyFinance()
  const { data: expenses } = useExpenses(5)
  const createExpense = useCreateExpense()
  const [category, setCategory] = useState('other')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  async function submit() {
    if (!amount) return
    await createExpense.mutateAsync({ category, amount: Number(amount), description })
    setAmount('')
    setDescription('')
  }

  return (
    <PortalCard title="Income & Expenses (This Month)">
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#16a34a' }}>{isLoading ? '—' : `₹${finance?.income ?? 0}`}</div>
          <div style={{ fontSize: 12, color: 'var(--text)' }}>Income</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#dc2626' }}>{isLoading ? '—' : `₹${finance?.expenses ?? 0}`}</div>
          <div style={{ fontSize: 12, color: 'var(--text)' }}>Expenses</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 100 }} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ flex: 1, minWidth: 120 }} />
        <button onClick={submit}>Add Expense</button>
      </div>

      {(expenses || []).map(e => (
        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ textTransform: 'capitalize' }}>{e.category}{e.description ? ` — ${e.description}` : ''}</span>
          <span>₹{e.amount}</span>
        </div>
      ))}
    </PortalCard>
  )
}
