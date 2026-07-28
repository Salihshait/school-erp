import React, { useState } from 'react'
import { useIssueBook } from '../../hooks/useLibrary'

export default function IssueBook() {
  const [copyId, setCopyId] = useState('')
  const [memberId, setMemberId] = useState('')
  const [due, setDue] = useState('')
  const issue = useIssueBook()

  async function submit() {
    await issue.mutateAsync({ copy_id: copyId, member_id: memberId, due_date: due })
    setCopyId('')
    setMemberId('')
    setDue('')
    alert('Issued (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Issue Book</h4>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Copy ID" value={copyId} onChange={e => setCopyId(e.target.value)} />
        <input placeholder="Member ID" value={memberId} onChange={e => setMemberId(e.target.value)} />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} />
      </div>
      <button onClick={submit}>Issue</button>
    </div>
  )
}
