import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { useAttendanceOverview } from '../../../hooks/useAttendance'
import { useMonthlyCollections } from '../../../hooks/useFees'
import PortalCard from '../../common/PortalCard'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

export default function DashboardCharts() {
  const attendance = useAttendanceOverview({ person_type: 'student' })
  const collections = useMonthlyCollections()

  const attendanceRows = attendance.data || []
  const collectionRows = collections.data || []

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
      <PortalCard title="Attendance Trend">
        {attendance.isLoading ? 'Loading...' : attendanceRows.length === 0 ? 'No attendance data yet.' : (
          <div style={{ height: 180 }}>
            <Bar
              data={{
                labels: attendanceRows.map(r => r.month),
                datasets: [
                  { label: 'Present', data: attendanceRows.map(r => r.present_count), backgroundColor: '#34d399' },
                  { label: 'Absent', data: attendanceRows.map(r => r.absent_count), backgroundColor: '#f87171' },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        )}
      </PortalCard>

      <PortalCard title="Fee Collection Trend">
        {collections.isLoading ? 'Loading...' : collectionRows.length === 0 ? 'No collection data yet.' : (
          <div style={{ height: 180 }}>
            <Line
              data={{
                labels: collectionRows.map(r => r.month),
                datasets: [{ label: 'Collected', data: collectionRows.map(r => r.total), borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.2)' }],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        )}
      </PortalCard>
    </div>
  )
}
