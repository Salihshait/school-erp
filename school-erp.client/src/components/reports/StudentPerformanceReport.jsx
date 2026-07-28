import React, { useMemo, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useClassResultSummary } from '../../hooks/useExam'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function StudentPerformanceReport() {
  const { data, isLoading } = useClassResultSummary()
  const [topN, setTopN] = useState(10)

  const rows = useMemo(() => {
    const withPct = (data || []).map(r => ({
      ...r,
      percentage: r.total_max > 0 ? (r.total_obtained / r.total_max) * 100 : 0,
    }))
    return withPct.sort((a, b) => b.percentage - a.percentage).slice(0, topN)
  }, [data, topN])

  return (
    <div>
      <h2>Student Performance Report</h2>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 13.5 }}>
          Show top{' '}
          <input type="number" min="1" value={topN} onChange={e => setTopN(Number(e.target.value) || 10)} style={{ width: 70 }} />
        </label>
      </div>
      <ReportSection title="Top Students by Overall Percentage" rows={rows} filename="student-performance-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No results recorded yet.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.student_id),
                  datasets: [{ label: 'Percentage', data: rows.map(r => r.percentage.toFixed(1)), backgroundColor: '#34d399' }],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.student_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Student {r.student_id}</span>
                <span>{r.percentage.toFixed(1)}% ({r.total_obtained}/{r.total_max})</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
