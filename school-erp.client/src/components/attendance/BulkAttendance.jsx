import React from 'react'
import { useBulkRecord } from '../../hooks/useAttendance'

export default function BulkAttendance() {
  const bulk = useBulkRecord()

  function onFile(e) {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = async () => {
      const text = reader.result
      // simple CSV parse: id,status per line (demo)
      const lines = text.split(/\r?\n/).filter(Boolean)
      const records = lines.map(line => {
        const [person_id, status] = line.split(',')
        return { person_id, person_type: 'student', status, session_id: null }
      })
      await bulk.mutateAsync(records)
      alert('Bulk uploaded')
    }
    reader.readAsText(f)
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Bulk Attendance</h4>
      <input type="file" accept=".csv" onChange={onFile} />
      <div style={{ fontSize: 12, color: '#666' }}>CSV: person_id,status</div>
    </div>
  )
}
