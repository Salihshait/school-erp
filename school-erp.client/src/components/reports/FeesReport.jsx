import React, { useMemo, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMonthlyCollections } from '../../hooks/useFees'
import ReportFilters, { filterByMonthRange } from './ReportFilters'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function FeesReport() {
  const { data, isLoading } = useMonthlyCollections()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const rows = useMemo(() => filterByMonthRange(data, 'month', from, to), [data, from, to])

  return (
    <div>
      <h2>Fees Report</h2>
      <ReportFilters from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ReportSection title="Fee Collection per Month" rows={rows} filename="fees-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No fee collections in this range.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.month),
                  datasets: [{ label: 'Collected', data: rows.map(r => r.total), backgroundColor: '#c084fc' }],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.month} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.month}</span>
                <span>₹{r.total}</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
