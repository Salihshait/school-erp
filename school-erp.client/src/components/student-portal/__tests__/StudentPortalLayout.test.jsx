import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import StudentPortalLayout from '../StudentPortalLayout'
import { useAuth } from '../../auth/AuthProvider'
import { useStudentProfile } from '../../../hooks/useStudentPortal'

vi.mock('../../auth/AuthProvider')
vi.mock('../../../hooks/useStudentPortal')

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/student-portal']}>
      <Routes>
        <Route path="/auth" element={<div>AUTH PAGE</div>} />
        <Route path="/student-portal" element={<StudentPortalLayout />}>
          <Route index element={<div>CHILD PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('StudentPortalLayout', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() })
    useStudentProfile.mockReturnValue({ data: null, isLoading: false })
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

  it('shows a message when no student record is linked to the account', () => {
    useAuth.mockReturnValue({ user: { email: 'nobody@example.com' }, loading: false, signOut: vi.fn() })
    useStudentProfile.mockReturnValue({ data: null, isLoading: false })
    renderLayout()
    expect(screen.getByText(/No student account is linked/)).toBeInTheDocument()
    expect(screen.getByText(/nobody@example.com/)).toBeInTheDocument()
  })

  it('renders the portal shell and child route when a student profile is found', () => {
    useAuth.mockReturnValue({ user: { email: 'ann@example.com' }, loading: false, signOut: vi.fn() })
    useStudentProfile.mockReturnValue({
      data: { id: 's1', first_name: 'Ann', last_name: 'Lee' },
      isLoading: false,
    })
    renderLayout()
    expect(screen.getByText('Ann Lee')).toBeInTheDocument()
    expect(screen.getByText('CHILD PAGE')).toBeInTheDocument()
    expect(screen.getByText('Certificates')).toBeInTheDocument()
  })
})
