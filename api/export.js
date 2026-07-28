// Vercel Serverless Function: /api/export
// Converts the previous Express /api/export into a serverless handler.

import crypto from 'crypto'

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

function base64UrlToBase64(input) {
  return input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=')
}

function verifyHmacSha256(message, secret, signatureB64Url) {
  const sig = crypto.createHmac('sha256', secret).update(message).digest('base64')
  const sigUrl = sig.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return sigUrl === signatureB64Url
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'POST')
    res.end('Method Not Allowed')
    return
  }

  let body = req.body
  // Vercel may parse JSON automatically; if not, try to read raw body
  if (!body) {
    try {
      const buf = await new Promise((resolve, reject) => {
        const chunks = []
        req.on('data', c => chunks.push(c))
        req.on('end', () => resolve(Buffer.concat(chunks)))
        req.on('error', reject)
      })
      const text = buf.toString('utf8')
      body = text ? JSON.parse(text) : {}
    } catch (err) {
      body = {}
    }
  }

  const { format = 'pdf', columns = [], permissions } = body || {}

  // JWT-based auth: verify Bearer token (HMAC-SHA256) using VERCEL_JWT_SECRET
  const secret = process.env.VERCEL_JWT_SECRET
  if (!secret) {
    res.statusCode = 500
    res.end('Server misconfiguration: VERCEL_JWT_SECRET is not set')
    return
  }

  let role = ''
  const authHeader = (req.headers && (req.headers.authorization || req.headers.Authorization)) || ''
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    res.statusCode = 401
    res.end('Unauthorized: missing Bearer token in Authorization header')
    return
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    res.statusCode = 401
    res.end('Unauthorized: malformed Authorization header')
    return
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token format')
    const [hdrB64, payloadB64, sigB64] = parts
    const message = `${hdrB64}.${payloadB64}`
    const sigB64Url = sigB64

    const ok = verifyHmacSha256(message, secret, sigB64Url)
    if (!ok) {
      res.statusCode = 401
      res.end('Unauthorized: invalid token signature')
      return
    }

    const payloadJson = Buffer.from(base64UrlToBase64(payloadB64), 'base64').toString('utf8')
    const payload = JSON.parse(payloadJson)

    // optional exp check
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      res.statusCode = 401
      res.end('Unauthorized: token expired')
      return
    }

    role = (payload.role || payload.r || '').toLowerCase()
  } catch (err) {
    res.statusCode = 401
    res.end('Unauthorized: token verification failed')
    return
  }

  if (!role || (role !== 'teacher' && role !== 'admin')) {
    res.statusCode = 403
    res.end('Forbidden: token missing required role claim')
    return
  }

  // Determine minimum role required for this export (default: teacher)
  const minRole = (permissions && permissions.minRole) ? String(permissions.minRole).toLowerCase() : 'teacher'
  if (minRole === 'admin' && role !== 'admin') {
    res.statusCode = 403
    res.end('Forbidden: admin role required to perform this export')
    return
  }

  // Apply report-level restrictions for non-admin roles by removing sensitive columns
  let cols = columns.length ? columns.slice() : ['studentName','assignment','grade','standards']
  const restrictCommentsToAdmin = permissions && permissions.restrictCommentsToAdmin
  const restrictStandardsToAdmin = permissions && permissions.restrictStandardsToAdmin
  if (role !== 'admin') {
    if (restrictCommentsToAdmin) cols = cols.filter(c => c !== 'comments')
    if (restrictStandardsToAdmin) cols = cols.filter(c => c !== 'standards')
  }

  if (cols.length === 0) {
    res.statusCode = 400
    res.end('Bad Request: no columns remain after applying export restrictions')
    return
  }

  if (format === 'csv') {
    const csv = buildCsv(cols)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="gradebook-export.csv"')
    res.end(csv)
    return
  }

  // PDF placeholder: include effective columns and permissions info
  const lines = [
    `Gradebook Export`,
    `Requested columns: ${columns.join(', ') || '(default)'}`,
    `Effective columns: ${cols.join(', ')}`,
    `Requester role: ${role}`,
    permissions ? `Permissions: ${JSON.stringify(permissions)}` : '',
    '',
    ...SAMPLE_ROWS.map(r => `${r.studentName} | ${r.assignment} | ${r.grade} | ${r.standards}`)
  ].filter(Boolean).join('\n')

  const buf = Buffer.from(lines, 'utf8')
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="gradebook-export.pdf"')
  res.end(buf)
}
