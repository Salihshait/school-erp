import React from 'react'
import Books from './Books'
import Categories from './Categories'
import IssueBook from './IssueBook'
import ReturnBook from './ReturnBook'
import BookSearch from './BookSearch'
import Reservation from './Reservation'
import History from './History'
import Dashboard from './Dashboard'
import Reports from './Reports'

export default function LibraryPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Library</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <Books />
          <Categories />
          <IssueBook />
          <ReturnBook />
          <Reservation />
          <History />
        </div>
        <div>
          <Dashboard />
          <Reports />
        </div>
      </div>
    </div>
  )
}
