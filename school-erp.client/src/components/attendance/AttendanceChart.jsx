import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AttendanceChart() {
  const data = {
    labels: ['Present','Absent','Late','On Leave'],
    datasets: [{ label: 'Counts', data: [120, 20, 5, 10], backgroundColor: ['#4ade80','#f87171','#fbbf24','#60a5fa'] }]
  }
  return (
    <div style={{ height: 180 }}>
      <Bar data={data} />
    </div>
  )
}
