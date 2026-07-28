import React, { useState } from 'react'

export default function TeacherFilters({ onChange }) {
  const [dept, setDept] = useState('')
  function apply() { onChange({ department_id: dept || undefined }) }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={dept} onChange={e => setDept(e.target.value)}>
        <option value="">All departments</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
      </select>
      <button onClick={apply}>Apply</button>
    </div>
  )
}
