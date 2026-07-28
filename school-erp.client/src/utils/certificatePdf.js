import jsPDF from 'jspdf'

const TITLES = {
  bonafide: 'Bonafide Certificate',
  transfer: 'Transfer Certificate',
  character: 'Character Certificate',
  achievement: 'Certificate of Achievement',
  other: 'Certificate',
}

export function generateCertificatePdf(certificate, student) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a5' })
  const { width } = doc.internal.pageSize
  const center = width / 2

  doc.setFontSize(22)
  doc.text(TITLES[certificate.certificate_type] || TITLES.other, center, 70, { align: 'center' })

  doc.setFontSize(12)
  const name = student ? `${student.first_name} ${student.last_name}` : certificate.student_id
  doc.text(`This is to certify that ${name}`, center, 120, { align: 'center' })
  if (student?.admission_number) {
    doc.text(`(Admission No: ${student.admission_number})`, center, 140, { align: 'center' })
  }

  if (certificate.remarks) {
    doc.text(doc.splitTextToSize(certificate.remarks, width - 100), center, 170, { align: 'center' })
  }

  doc.setFontSize(10)
  doc.text(`Issued on: ${certificate.issued_date}`, 60, 250)

  doc.save(`certificate-${certificate.certificate_type}-${certificate.id}.pdf`)
}
