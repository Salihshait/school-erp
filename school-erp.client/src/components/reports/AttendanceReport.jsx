import React, { useMemo, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useAttendanceOverview } from '../../hooks/useAttendance'
import ReportFilters, { filterByMonthRange } from './ReportFilters'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function AttendanceReport() {
  const [personType, setPersonType] = useState('student')
  const { data, isLoading } = useAttendanceOverview({ person_type: personType })
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const rows = useMemo(() => filterByMonthRange(data, 'month', from, to), [data, from, to])

  return (
    <div>
      <h2>Attendance Report</h2>
      <div style={{ marginBottom: 8 }}>
        <select value={personType} onChange={e => setPersonType(e.target.value)}>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
        </select>
      </div>
      <ReportFilters from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ReportSection title="Attendance per Month" rows={rows} filename="attendance-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No attendance records in this range.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.month),
                  datasets: [
                    { label: 'Present', data: rows.map(r => r.present_count), backgroundColor: '#34d399' },
                    { label: 'Absent', data: rows.map(r => r.absent_count), backgroundColor: '#f87171' },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.month} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.month}</span>
                <span>Present {r.present_count} • Absent {r.absent_count}</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
