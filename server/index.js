const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Simple in-memory sample data for export
const SAMPLE_ROWS = [
  { studentName: 'Alice', studentId: 'S001', assignment: 'Math Quiz 1', grade: 92, standards: 'MA.5.NF', comments: 'Good work' },
  { studentName: 'Bob', studentId: 'S002', assignment: 'Math Quiz 1', grade: 78, standards: 'MA.5.NF', comments: 'Needs practice' },
  { studentName: 'Cara', studentId: 'S003', assignment: 'Math Quiz 1', grade: 85, standards: 'MA.5.NF', comments: '' },
]

function buildCsv(columns) {
  const header = columns.map(c => {
    switch (c) {
      case 'studentName': return 'Student Name'
      case 'studentId': return 'Student ID'
      case 'assignment': return 'Assignment'
      case 'grade': return 'Grade'
      case 'standards': return 'Standards'
      case 'comments': return 'Comments'
      default: return c
    }
  }).join(',')

  const rows = SAMPLE_ROWS.map(r => columns.map(col => {
    const v = r[col]
    return typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : (v == null ? '' : v)
  }).join(','))

  return [header, ...rows].join('\n')
}

app.post('/api/export', (req, res) => {
  const { format = 'pdf', columns = [], permissions } = req.body || {}

  const secret = process.env.VERCEL_JWT_SECRET || process.env.JWT_SECRET || ''
  if (!secret) {
    res.status(500).send('Server misconfiguration: JWT secret not set')
    return
  }

  // Parse Authorization Bearer token
  const auth = req.headers.authorization || ''
  if (!auth.toLowerCase().startsWith('bearer ')) {
    res.status(401).send('Unauthorized: missing Bearer token')
    return
  }

  const token = auth.split(' ')[1]
  const parts = (token || '').split('.')
  if (parts.length !== 3) {
    res.status(401).send('Unauthorized: invalid token format')
    return
  }

  const [hdrB64, payloadB64, sigB64] = parts
  const message = `${hdrB64}.${payloadB64}`

  // verify signature
  function verify(message, secret, sigB64Url) {
    const sig = crypto.createHmac('sha256', secret).update(message).digest('base64')
    const sigUrl = sig.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return sigUrl === sigB64Url
  }

  if (!verify(message, secret, sigB64)) {
    res.status(401).send('Unauthorized: invalid token signature')
    return
  }

  const payloadJson = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
  let payload = {}
  try { payload = JSON.parse(payloadJson) } catch (e) { payload = {} }

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    res.status(401).send('Unauthorized: token expired')
    return
  }

  const role = (payload.role || payload.r || '').toLowerCase()
  if (!role || (role !== 'teacher' && role !== 'admin')) {
    res.status(403).send('Forbidden: token missing required role claim')
    return
  }

  const minRole = (permissions && permissions.minRole) ? String(permissions.minRole).toLowerCase() : 'teacher'
  if (minRole === 'admin' && role !== 'admin') {
    res.status(403).send('Forbidden: admin role required to perform this export')
    return
  }

  // Apply report-level restrictions for non-admins
  let cols = columns.length ? columns.slice() : ['studentName','assignment','grade','standards']
  const restrictCommentsToAdmin = permissions && permissions.restrictCommentsToAdmin
  const restrictStandardsToAdmin = permissions && permissions.restrictStandardsToAdmin
  if (role !== 'admin') {
    if (restrictCommentsToAdmin) cols = cols.filter(c => c !== 'comments')
    if (restrictStandardsToAdmin) cols = cols.filter(c => c !== 'standards')
  }

  if (cols.length === 0) {
    res.status(400).send('Bad Request: no columns remain after applying export restrictions')
    return
  }

  if (format === 'csv') {
    const csv = buildCsv(cols)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="gradebook-export.csv"')
    return res.send(csv)
  }

  const lines = [
    `Gradebook Export`,
    `Effective columns: ${cols.join(', ')}`,
    `Requester role: ${role}`,
    '',
    ...SAMPLE_ROWS.map(r => `${r.studentName} | ${r.assignment} | ${r.grade} | ${r.standards}`)
  ].join('\n')

  const buf = Buffer.from(lines, 'utf8')
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="gradebook-export.pdf"')
  res.send(buf)
})

app.listen(port, () => {
  console.log(`Export server listening on http://localhost:${port}`)
})
