import React, { useMemo, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useBookIssueSummary } from '../../hooks/useReports'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function LibraryReport() {
  const { data, isLoading } = useBookIssueSummary()
  const [topN, setTopN] = useState(10)

  const rows = useMemo(() => (data || []).slice(0, topN), [data, topN])

  return (
    <div>
      <h2>Library Report</h2>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 13.5 }}>
          Show top{' '}
          <input type="number" min="1" value={topN} onChange={e => setTopN(Number(e.target.value) || 10)} style={{ width: 70 }} />
        </label>
      </div>
      <ReportSection title="Most Issued Books" rows={rows} filename="library-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No book issues recorded yet.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.title),
                  datasets: [{ label: 'Times Issued', data: rows.map(r => r.total_issues), backgroundColor: '#fbbf24' }],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.book_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.title}</span>
                <span>{r.total_issues} issues</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
