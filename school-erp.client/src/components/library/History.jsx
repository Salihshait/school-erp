import React from 'react'
import { getBookHistory } from '../../services/libraryService'

export default function History() {
  async function show() {
    const data = await getBookHistory({ person_id: '00000000-0000-0000-0000-000000000000' })
    alert(JSON.stringify(data))
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Book History</h4>
      <button onClick={show}>Show demo history</button>
    </div>
  )
}
