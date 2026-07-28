import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { usePayrollSummary } from '../../hooks/usePayroll'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function PayrollChart() {
  const { data, isLoading } = usePayrollSummary()

  if (isLoading) return <div>Loading chart...</div>

  const rows = data || []
  const chartData = {
    labels: rows.map(r => r.month),
    datasets: [
      { label: 'Gross', data: rows.map(r => r.total_gross || 0), backgroundColor: '#60a5fa' },
      { label: 'Net', data: rows.map(r => r.total_net || 0), backgroundColor: '#34d399' },
    ],
  }

  return (
    <div style={{ height: 220 }}>
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  )
}
