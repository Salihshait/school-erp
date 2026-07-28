import React, { useState } from 'react'

export default function StudentFilters({ onChange }) {
  const [cls, setCls] = useState('')
  const [section, setSection] = useState('')

  function apply() {
    onChange({ class_id: cls || undefined, section: section || undefined })
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={cls} onChange={e => setCls(e.target.value)}>
        <option value="">All classes</option>
        <option value="5">Class 5</option>
        <option value="6">Class 6</option>
      </select>
      <select value={section} onChange={e => setSection(e.target.value)}>
        <option value="">All sections</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>
      <button onClick={apply}>Apply</button>
    </div>
  )
}
