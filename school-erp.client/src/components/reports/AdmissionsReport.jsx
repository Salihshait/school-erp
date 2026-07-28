import React, { useMemo, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useAdmissionsMonthly } from '../../hooks/useReports'
import ReportFilters, { filterByMonthRange } from './ReportFilters'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function AdmissionsReport() {
  const { data, isLoading } = useAdmissionsMonthly()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const rows = useMemo(() => filterByMonthRange(data, 'month', from, to), [data, from, to])

  return (
    <div>
      <h2>Admissions Report</h2>
      <ReportFilters from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ReportSection title="Admissions per Month" rows={rows} filename="admissions-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No admission records in this range.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.month),
                  datasets: [{ label: 'Admissions', data: rows.map(r => r.count), backgroundColor: '#60a5fa' }],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.month} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.month}</span>
                <span>{r.count}</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
