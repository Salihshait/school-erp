import React, { useMemo, useState } from 'react'
import { usePayrollSummary } from '../../hooks/usePayroll'
import PayrollChart from '../payroll/PayrollChart'
import ReportFilters, { filterByMonthRange } from './ReportFilters'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

export default function PayrollReport() {
  const { data, isLoading } = usePayrollSummary()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const rows = useMemo(() => filterByMonthRange(data, 'month', from, to), [data, from, to])

  return (
    <div>
      <h2>Payroll Report</h2>
      <ReportFilters from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ReportSection title="Gross vs Net per Month" rows={rows} filename="payroll-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No payslips generated in this range.</EmptyState>
        ) : (
          <>
            <PayrollChart />
            {rows.map(r => (
              <div key={r.month} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.month}</span>
                <span>Gross ₹{r.total_gross} • Net ₹{r.total_net}</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
