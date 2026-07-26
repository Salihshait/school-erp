const http = require('http')
const fs = require('fs')

const data = JSON.stringify({ format: 'csv', columns: ['studentName', 'grade'] })

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/export',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
}

const req = http.request(options, (res) => {
  const chunks = []
  res.on('data', (chunk) => chunks.push(chunk))
  res.on('end', () => {
    const buf = Buffer.concat(chunks)
    fs.writeFileSync('test-export3.csv', buf)
    console.log('Saved', buf.length, 'bytes to test-export3.csv')
  })
})

req.on('error', (e) => console.error('Request error', e))
req.write(data)
req.end()
