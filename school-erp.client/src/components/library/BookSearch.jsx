import React, { useState } from 'react'
import { useSearchBooks } from '../../hooks/useLibrary'

export default function BookSearch() {
  const [q, setQ] = useState('')
  const results = useSearchBooks(q)

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Book Search</h4>
      <input placeholder="Search title" value={q} onChange={e => setQ(e.target.value)} />
      <div>
        {results.isLoading ? 'Searching...' : results.data?.map(b => <div key={b.id}>{b.title} — {b.author}</div>)}
      </div>
    </div>
  )
}
