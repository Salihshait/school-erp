import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useVehicleUtilization } from '../../hooks/useTransport'
import ReportSection from './ReportSection'
import EmptyState from '../common/EmptyState'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function TransportReport() {
  const { data, isLoading } = useVehicleUtilization()
  const rows = data || []

  return (
    <div>
      <h2>Transport Report</h2>
      <ReportSection title="Allocations per Vehicle" rows={rows} filename="transport-report">
        {isLoading ? 'Loading...' : rows.length === 0 ? (
          <EmptyState>No vehicle allocations recorded yet.</EmptyState>
        ) : (
          <>
            <div style={{ height: 220, marginBottom: 12 }}>
              <Bar
                data={{
                  labels: rows.map(r => r.reg_no),
                  datasets: [{ label: 'Allocations', data: rows.map(r => r.allocations), backgroundColor: '#60a5fa' }],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            {rows.map(r => (
              <div key={r.vehicle_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{r.reg_no}</span>
                <span>{r.allocations} allocations</span>
              </div>
            ))}
          </>
        )}
      </ReportSection>
    </div>
  )
}
