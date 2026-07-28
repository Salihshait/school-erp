import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useExamPerformance } from '../../hooks/useReports'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function ExamsReport() {
  const { data, isLoading } = useExamPerformance()
  const rows = data || []

  return (
    <div>
      <h2>Exams Report</h2>
      <ReportSection title="Average Marks per Exam" rows={rows} filename="exams-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No exam results recorded yet.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.title),
                  datasets: [
                    { label: 'Pass', data: rows.map(r => r.pass_count), backgroundColor: '#34d399' },
                    { label: 'Fail', data: rows.map(r => r.fail_count), backgroundColor: '#f87171' },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.exam_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.title}</span>
                <span>Avg {Number(r.avg_marks).toFixed(1)}/{Number(r.avg_max_marks).toFixed(0)} • Pass {r.pass_count} • Fail {r.fail_count}</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
