import jsPDF from 'jspdf'

export function generatePayslipPdf(payslip) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a5' })
  const left = 40
  let y = 50

  doc.setFontSize(16)
  doc.text('Payslip', left, y)
  y += 24

  doc.setFontSize(10)
  doc.text(`Month: ${payslip.month}`, left, y)
  y += 16
  doc.text(`Employee ID: ${payslip.teacher_id}`, left, y)
  y += 24

  doc.setFontSize(12)
  doc.text('Earnings', left, y)
  doc.text('Deductions', left + 200, y)
  y += 16

  doc.setFontSize(10)
  doc.text(`Basic: ${payslip.basic}`, left, y)
  doc.text(`PF: ${payslip.pf_amount}`, left + 200, y)
  y += 14
  doc.text(`Allowances: ${payslip.total_allowances}`, left, y)
  doc.text(`ESI: ${payslip.esi_amount}`, left + 200, y)
  y += 14
  doc.text('', left, y)
  doc.text(`Professional Tax: ${payslip.pt_amount}`, left + 200, y)
  y += 14
  doc.text('', left, y)
  doc.text(`Other Deductions: ${(payslip.total_deductions - payslip.pf_amount - payslip.esi_amount - payslip.pt_amount).toFixed(2)}`, left + 200, y)
  y += 24

  doc.line(left, y, left + 320, y)
  y += 18

  doc.setFontSize(11)
  doc.text(`Gross Salary: ${payslip.gross_salary}`, left, y)
  y += 16
  doc.text(`Total Deductions: ${payslip.total_deductions}`, left, y)
  y += 16
  doc.setFontSize(13)
  doc.text(`Net Salary: ${payslip.net_salary}`, left, y)

  doc.save(`payslip-${payslip.teacher_id}-${payslip.month}.pdf`)
}
