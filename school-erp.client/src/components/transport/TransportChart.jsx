import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function TransportChart() {
  const data = { labels: ['Route A','Route B','Route C'], datasets: [{ label: 'Trips', data: [120, 80, 45], backgroundColor: ['#34d399','#60a5fa','#f87171'] }] }
  return (
    <div style={{ height: 180 }}>
      <Bar data={data} />
    </div>
  )
}
