import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ParentFeesPage from '../ParentFeesPage'
import { useParentPortalContext } from '../ParentPortalContext'
import * as useFeesHooks from '../../../hooks/useFees'

vi.mock('../ParentPortalContext')
vi.mock('../../../hooks/useFees')

describe('ParentFeesPage', () => {
  const payFeeMutate = vi.fn()

  beforeEach(() => {
    payFeeMutate.mockClear()
    useParentPortalContext.mockReturnValue({ studentId: 's1' })
    useFeesHooks.usePendingFees.mockReturnValue({
      data: [{ id: 'f1', amount: 5000, due_date: '2026-08-01' }],
      isLoading: false,
    })
    useFeesHooks.usePayFee.mockReturnValue({ mutate: payFeeMutate, isLoading: false })
  })

  it('renders pending fees for the linked student', () => {
    render(<ParentFeesPage />)
    expect(screen.getByText(/₹5000/)).toBeInTheDocument()
  })

  it('pays a fee with the student and fee IDs', () => {
    render(<ParentFeesPage />)
    fireEvent.click(screen.getByText('Pay Now'))
    expect(payFeeMutate).toHaveBeenCalledWith({ fee_id: 'f1', student_id: 's1', amount: 5000 })
  })

  it('shows an empty state when there are no pending fees', () => {
    useFeesHooks.usePendingFees.mockReturnValue({ data: [], isLoading: false })
    render(<ParentFeesPage />)
    expect(screen.getByText(/all caught up/)).toBeInTheDocument()
  })
})
