import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTeacherPerformanceSummary } from '../../hooks/useReports'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function TeacherPerformanceReport() {
  const { data, isLoading } = useTeacherPerformanceSummary()
  const rows = (data || []).filter(r => r.reviews_count > 0)

  return (
    <div>
      <h2>Teacher Performance Report</h2>
      <ReportSection title="Average Review Score per Teacher" rows={rows} filename="teacher-performance-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No performance reviews recorded yet.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => `${r.first_name} ${r.last_name}`),
                  datasets: [{ label: 'Avg Score', data: rows.map(r => Number(r.avg_score).toFixed(1)), backgroundColor: '#c084fc' }],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.teacher_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.first_name} {r.last_name}</span>
                <span>Avg {Number(r.avg_score).toFixed(1)} ({r.reviews_count} reviews)</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
