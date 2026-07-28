import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ParentPortalLayout from '../ParentPortalLayout'
import { useAuth } from '../../auth/AuthProvider'
import { useParentProfile } from '../../../hooks/useParentPortal'

vi.mock('../../auth/AuthProvider')
vi.mock('../../../hooks/useParentPortal')

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/parent']}>
      <Routes>
        <Route path="/auth" element={<div>AUTH PAGE</div>} />
        <Route path="/parent" element={<ParentPortalLayout />}>
          <Route index element={<div>CHILD PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('ParentPortalLayout', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() })
    useParentProfile.mockReturnValue({ data: null, isLoading: false })
  })

  it('redirects to /auth when not logged in', () => {
    renderLayout()
    expect(screen.getByText('AUTH PAGE')).toBeInTheDocument()
  })

  it('shows a loading state while auth is resolving', () => {
    useAuth.mockReturnValue({ user: null, loading: true, signOut: vi.fn() })
    renderLayout()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows a message when no parent record is linked to the account', () => {
    useAuth.mockReturnValue({ user: { email: 'nobody@example.com' }, loading: false, signOut: vi.fn() })
    useParentProfile.mockReturnValue({ data: null, isLoading: false })
    renderLayout()
    expect(screen.getByText(/No parent account is linked/)).toBeInTheDocument()
    expect(screen.getByText(/nobody@example.com/)).toBeInTheDocument()
  })

  it('renders the portal shell and child route when a parent profile is found', () => {
    useAuth.mockReturnValue({ user: { email: 'mom@example.com' }, loading: false, signOut: vi.fn() })
    useParentProfile.mockReturnValue({
      data: { id: 'par1', students: { first_name: 'Ann', last_name: 'Lee' } },
      isLoading: false,
    })
    renderLayout()
    expect(screen.getByText('Ann Lee')).toBeInTheDocument()
    expect(screen.getByText('CHILD PAGE')).toBeInTheDocument()
    expect(screen.getByText('Teacher Chat')).toBeInTheDocument()
  })
})
