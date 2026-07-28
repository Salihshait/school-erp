import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useRoomOccupancy } from '../../hooks/useHostel'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function HostelChart() {
  const { data, isLoading } = useRoomOccupancy()

  if (isLoading) return <div>Loading chart...</div>

  const rooms = data || []
  const chartData = {
    labels: rooms.map(r => r.room_number),
    datasets: [
      { label: 'Occupied', data: rooms.map(r => r.occupied_beds || 0), backgroundColor: '#f87171' },
      { label: 'Vacant', data: rooms.map(r => r.vacant_beds || 0), backgroundColor: '#34d399' },
    ],
  }

  return (
    <div style={{ height: 220 }}>
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
    </div>
  )
}
