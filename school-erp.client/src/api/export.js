export async function generateExport({ format = 'pdf', columns = [] } = {}) {
  // Client-side stub that calls the server endpoint. If server is not available,
  // fall back to a minimal synthetic response so the UI can be tested.
  try {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, columns }),
    })

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`)
    }

    // For CSV, server may return text, for PDF a blob
    if (format === 'csv') {
      const text = await res.text()
      return new Blob([text], { type: 'text/csv' })
    }

    const blob = await res.blob()
    return blob
  } catch (err) {
    // Fallback: return a tiny CSV or PDF-like blob for local testing
    if (format === 'csv') {
      const sample = 'Student Name,Assignment,Grade,Standards\nAlice,Math Test,92,MA.5.NF\n'
      return new Blob([sample], { type: 'text/csv' })
    }

    // Create a minimal PDF-like blob (not a real PDF) so download works in UI tests
    const samplePdf = new Blob([`Export (${format}) - columns: ${columns.join(',')}`], { type: 'application/pdf' })
    return samplePdf
  }
}
