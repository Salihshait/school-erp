import React from 'react'
import Routes from './Routes'
import Vehicles from './Vehicles'
import Drivers from './Drivers'
import Allocation from './Allocation'
import Maintenance from './Maintenance'
import FuelExpenses from './FuelExpenses'
import TransportDashboard from './TransportDashboard'
import TransportReports from './TransportReports'

export default function TransportPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Transport</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <Routes />
          <Vehicles />
          <Drivers />
          <Allocation />
          <Maintenance />
          <FuelExpenses />
        </div>
        <div>
          <TransportDashboard />
          <TransportReports />
        </div>
      </div>
    </div>
  )
}
