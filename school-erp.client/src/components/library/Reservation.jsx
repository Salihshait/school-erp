import React, { useState } from 'react'
import { useReserveBook } from '../../hooks/useLibrary'

export default function Reservation() {
  const [bookId, setBookId] = useState('')
  const [memberId, setMemberId] = useState('')
  const reserve = useReserveBook()

  async function submit() {
    await reserve.mutateAsync({ book_id: bookId, member_id: memberId, expires_at: new Date(Date.now()+3*24*3600*1000).toISOString() })
    setBookId('')
    setMemberId('')
    alert('Reserved (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Reservation</h4>
      <div>
        <input placeholder="Book ID" value={bookId} onChange={e => setBookId(e.target.value)} />
        <input placeholder="Member ID" value={memberId} onChange={e => setMemberId(e.target.value)} />
        <button onClick={submit}>Reserve</button>
      </div>
    </div>
  )
}
