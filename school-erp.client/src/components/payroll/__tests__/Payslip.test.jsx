import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Payslip from '../Payslip'
import * as usePayrollHooks from '../../../hooks/usePayroll'
import { generatePayslipPdf } from '../../../utils/payslipPdf'

vi.mock('../../../hooks/usePayroll')
vi.mock('../../../utils/payslipPdf', () => ({ generatePayslipPdf: vi.fn() }))

describe('Payslip', () => {
  const generateMutateAsync = vi.fn().mockResolvedValue({})

  beforeEach(() => {
    generateMutateAsync.mockClear()
    generatePayslipPdf.mockClear()
    usePayrollHooks.usePayslips.mockReturnValue({
      data: [{ id: 'p1', teacher_id: 't1', month: '2026-07-01', gross_salary: 38500, net_salary: 36000, status: 'generated' }],
      isLoading: false,
    })
    usePayrollHooks.useGeneratePayslip.mockReturnValue({ mutateAsync: generateMutateAsync })
  })

  it('renders existing payslips with gross/net amounts', () => {
    render(<Payslip />)
    expect(screen.getByText(/Gross ₹38500, Net ₹36000/)).toBeInTheDocument()
  })

  it('generates a payslip for the entered teacher and month', async () => {
    render(<Payslip />)
    fireEvent.change(screen.getByPlaceholderText('Teacher ID'), { target: { value: 't2' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Generate Payslip'))
    })
    expect(generateMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ teacher_id: 't2' })
    )
  })

  it('does not generate when teacher ID is blank', () => {
    render(<Payslip />)
    fireEvent.click(screen.getByText('Generate Payslip'))
    expect(generateMutateAsync).not.toHaveBeenCalled()
  })

  it('downloads the PDF for a payslip row', () => {
    render(<Payslip />)
    fireEvent.click(screen.getByText('Download PDF'))
    expect(generatePayslipPdf).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1' })
    )
  })
})
