import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { useAuth } from '../AuthProvider'

vi.mock('../AuthProvider')

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/auth" element={<div>AUTH PAGE</div>} />
        <Route path="/dashboard" element={<ProtectedRoute><div>SECRET DASHBOARD</div></ProtectedRoute>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuth.mockReset()
  })

  it('shows a loading state while auth is resolving', () => {
    useAuth.mockReturnValue({ user: null, loading: true })
    renderProtected()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to /auth when there is no user', () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    renderProtected()
    expect(screen.getByText('AUTH PAGE')).toBeInTheDocument()
  })

  it('renders the protected content when a user is present', () => {
    useAuth.mockReturnValue({ user: { email: 'a@b.com' }, loading: false })
    renderProtected()
    expect(screen.getByText('SECRET DASHBOARD')).toBeInTheDocument()
  })
})
