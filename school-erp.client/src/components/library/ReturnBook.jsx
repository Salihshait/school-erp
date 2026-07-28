import React, { useState } from 'react'
import { useReturnBook, useRenewBook } from '../../hooks/useLibrary'

export default function ReturnBook() {
  const [issueId, setIssueId] = useState('')
  const [renewDays, setRenewDays] = useState(0)
  const ret = useReturnBook()
  const renew = useRenewBook()

  async function doReturn() {
    await ret.mutateAsync({ issue_id: issueId, returned_at: new Date().toISOString() })
    setIssueId('')
    alert('Returned (demo)')
  }

  async function doRenew() {
    await renew.mutateAsync({ issue_id: issueId, additional_days: parseInt(renewDays) })
    alert('Renewed (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Return / Renew</h4>
      <div>
        <input placeholder="Issue ID" value={issueId} onChange={e => setIssueId(e.target.value)} />
        <button onClick={doReturn}>Return</button>
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Renew days" type="number" value={renewDays} onChange={e => setRenewDays(e.target.value)} />
        <button onClick={doRenew}>Renew</button>
      </div>
    </div>
  )
}
