import React, { useState } from 'react'
import { generateExport } from '../../api/export'

const DEFAULT_COLUMNS = [
  { key: 'studentName', label: 'Student Name', checked: true },
  { key: 'studentId', label: 'Student ID', checked: true },
  { key: 'assignment', label: 'Assignment', checked: true },
  { key: 'grade', label: 'Grade', checked: true },
  { key: 'standards', label: 'Standards Alignment', checked: true },
  { key: 'comments', label: 'Inline Comments', checked: false },
]

export default function ExportPage() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [format, setFormat] = useState('pdf')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [minRole, setMinRole] = useState('teacher') // who may export: 'teacher' or 'admin'
  const [restrictCommentsToAdmin, setRestrictCommentsToAdmin] = useState(false)
  const [restrictStandardsToAdmin, setRestrictStandardsToAdmin] = useState(false)

  function toggleColumn(key) {
    setColumns(cols => cols.map(c => c.key === key ? { ...c, checked: !c.checked } : c))
  }

  async function handleExport() {
    const selected = columns.filter(c => c.checked).map(c => c.key)
    const permissions = {
      minRole,
      restrictCommentsToAdmin,
      restrictStandardsToAdmin,
    }
    const payload = { format, columns: selected, permissions }
    try {
      const blob = await generateExport(payload)
      // trigger download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gradebook-export.${format === 'csv' ? 'csv' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Export failed: ' + (err.message || 'unknown'))
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Export Gradebook</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Format:</label>
        <label style={{ marginRight: 8 }}><input type="radio" checked={format==='pdf'} onChange={() => setFormat('pdf')} /> PDF</label>
        <label><input type="radio" checked={format==='csv'} onChange={() => setFormat('csv')} /> CSV</label>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h4>Columns</h4>
        {columns.map(col => (
          <div key={col.key}>
            <label>
              <input type="checkbox" checked={col.checked} onChange={() => toggleColumn(col.key)} /> {col.label}
            </label>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setPreviewOpen(true)}>Preview</button>
        <button onClick={handleExport}>Download {format.toUpperCase()}</button>
      </div>

      {previewOpen && (
        <div style={{ position: 'fixed', left: 0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.4)'}} onClick={() => setPreviewOpen(false)}>
          <div style={{ background:'#fff', margin:'5% auto', padding:20, width:800 }} onClick={e=>e.stopPropagation()}>
            <h3>Export Preview</h3>
            <p><strong>Format:</strong> {format.toUpperCase()}</p>
            <p><strong>Columns included:</strong></p>
            <ul>
              {columns.filter(c=>c.checked).map(c=> <li key={c.key}>{c.label}</li>)}
            </ul>
            <p><strong>Alignment metadata will be included:</strong> Standards codes and mastery where available.</p>
            <p><strong>Minimum role required to export:</strong> {minRole}</p>
            <p><strong>Report-level restrictions:</strong></p>
            <ul>
              <li>Comments: {restrictCommentsToAdmin ? 'Admin only' : 'Allowed'}</li>
              <li>Standards: {restrictStandardsToAdmin ? 'Admin only' : 'Allowed'}</li>
            </ul>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => { setPreviewOpen(false); handleExport(); }}>Confirm & Download</button>
              <button onClick={() => setPreviewOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginTop: 20, padding: 12, borderTop: '1px dashed #ddd' }}>
        <h4>Export Permissions</h4>
        <div style={{ marginBottom: 8 }}>
          <label style={{ marginRight: 8 }}>Minimum role to export:</label>
          <label style={{ marginRight: 8 }}><input type="radio" checked={minRole==='teacher'} onChange={() => setMinRole('teacher')} /> Teacher</label>
          <label><input type="radio" checked={minRole==='admin'} onChange={() => setMinRole('admin')} /> Admin</label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label><input type="checkbox" checked={restrictCommentsToAdmin} onChange={() => setRestrictCommentsToAdmin(s => !s)} /> Restrict inline comments to Admin on export</label>
        </div>

        <div>
          <label><input type="checkbox" checked={restrictStandardsToAdmin} onChange={() => setRestrictStandardsToAdmin(s => !s)} /> Restrict standards alignment metadata to Admin on export</label>
        </div>
      </div>
    </div>
  )
}
