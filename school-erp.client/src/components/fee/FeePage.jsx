import React from 'react'
import FeeCategories from './FeeCategories'
import FeeCollection from './FeeCollection'
import PaymentHistory from './PaymentHistory'
import FeeReports from './FeeReports'

export default function FeePage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Fee Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <FeeCategories />
          <FeeCollection />
          <PaymentHistory />
        </div>
        <div>
          <FeeReports />
        </div>
      </div>
    </div>
  )
}
