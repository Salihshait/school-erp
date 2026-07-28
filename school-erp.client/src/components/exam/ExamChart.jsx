import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ExamChart() {
  const data = { labels: ['A','B','C','D','F'], datasets: [{ data: [40,30,15,10,5], backgroundColor: ['#10b981','#60a5fa','#fbbf24','#f97316','#ef4444'] }] }
  return (
    <div style={{ height: 180 }}>
      <Doughnut data={data} />
    </div>
  )
}
