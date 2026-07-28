import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function FeeChart() {
  const data = {
    labels: ['Jan','Feb','Mar','Apr','May'],
    datasets: [{ label: 'Collection', data: [5000, 7000, 6500, 8000, 9000], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.2)' }]
  }
  return (
    <div style={{ height: 200 }}>
      <Line data={data} />
    </div>
  )
}
