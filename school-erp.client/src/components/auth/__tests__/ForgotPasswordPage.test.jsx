import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ForgotPasswordPage from '../ForgotPasswordPage'
import { useAuth } from '../AuthProvider'

vi.mock('../AuthProvider')

describe('ForgotPasswordPage', () => {
  const requestPasswordReset = vi.fn()

  beforeEach(() => {
    requestPasswordReset.mockReset()
    useAuth.mockReturnValue({ requestPasswordReset })
  })

  it('shows a confirmation message after a successful request', async () => {
    requestPasswordReset.mockResolvedValue()
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a@b.com' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Send reset link'))
    })

    expect(requestPasswordReset).toHaveBeenCalledWith('a@b.com')
    expect(screen.getByText(/Check your email/)).toBeInTheDocument()
    expect(screen.getByText(/a@b.com/)).toBeInTheDocument()
  })

  it('shows an error message when the request fails', async () => {
    requestPasswordReset.mockRejectedValue(new Error('rate limited'))
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a@b.com' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Send reset link'))
    })

    expect(screen.getByText('rate limited')).toBeInTheDocument()
  })
})
