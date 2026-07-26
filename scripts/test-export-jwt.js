#!/usr/bin/env node
// Test script: sign a JWT (HS256) and POST to /api/export
// Usage examples:
//  TARGET_URL=http://localhost:5174/api/export VERCEL_JWT_SECRET=secret node scripts/test-export-jwt.js
//  node scripts/test-export-jwt.js http://localhost:4000/api/export secret admin out.csv csv

const crypto = require('crypto')
const fs = require('fs')

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
}

function signToken(secret, role, expiresInSeconds = 3600) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({ role, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }))
  const message = `${header}.${payload}`
  const sig = crypto.createHmac('sha256', secret).update(message).digest('base64')
  const sigUrl = sig.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
  return `${message}.${sigUrl}`
}

async function main() {
  const argv = process.argv.slice(2)
  const target = process.env.TARGET_URL || argv[0] || 'http://localhost:5174/api/export'
  const secret = process.env.VERCEL_JWT_SECRET || argv[1] || 'test-secret'
  const role = process.env.ROLE || argv[2] || 'admin'
  const outFile = process.env.OUTFILE || argv[3] || 'test-export-jwt-output.bin'
  const format = process.env.FORMAT || argv[4] || 'csv'

  const token = signToken(secret, role)
  console.log('Using target:', target)
  console.log('Role:', role)
  // node's global fetch is available on Node 18+. If not present, user should run with a newer Node or install node-fetch.
  if (typeof fetch !== 'function') {
    console.error('global fetch is not available in this Node runtime. Use Node 18+ or install node-fetch.')
  }

  const body = {
    format,
    columns: ['studentName', 'assignment', 'grade', 'standards', 'comments'],
    permissions: { minRole: 'teacher', restrictCommentsToAdmin: true, restrictStandardsToAdmin: false }
  }

  try {
    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })

    console.log('Response status:', res.status)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(outFile, buf)
    console.log('Saved response to', outFile)
    if (res.headers.get('content-type')) console.log('Content-Type:', res.headers.get('content-type'))
  } catch (err) {
    console.error('Request failed:', err)
  }
}

main()
