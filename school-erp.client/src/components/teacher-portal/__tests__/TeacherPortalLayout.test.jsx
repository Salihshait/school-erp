import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TeacherPortalLayout from '../TeacherPortalLayout'
import { useAuth } from '../../auth/AuthProvider'
import { useTeacherProfile } from '../../../hooks/useTeacherPortal'

vi.mock('../../auth/AuthProvider')
vi.mock('../../../hooks/useTeacherPortal')

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/teacher-portal']}>
      <Routes>
        <Route path="/auth" element={<div>AUTH PAGE</div>} />
        <Route path="/teacher-portal" element={<TeacherPortalLayout />}>
          <Route index element={<div>CHILD PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('TeacherPortalLayout', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() })
    useTeacherProfile.mockReturnValue({ data: null, isLoading: false })
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

  it('shows a message when no teacher record is linked to the account', () => {
    useAuth.mockReturnValue({ user: { email: 'nobody@example.com' }, loading: false, signOut: vi.fn() })
    useTeacherProfile.mockReturnValue({ data: null, isLoading: false })
    renderLayout()
    expect(screen.getByText(/No teacher account is linked/)).toBeInTheDocument()
    expect(screen.getByText(/nobody@example.com/)).toBeInTheDocument()
  })

  it('renders the portal shell and child route when a teacher profile is found', () => {
    useAuth.mockReturnValue({ user: { email: 'jane@example.com' }, loading: false, signOut: vi.fn() })
    useTeacherProfile.mockReturnValue({
      data: { id: 't1', first_name: 'Jane', last_name: 'Doe' },
      isLoading: false,
    })
    renderLayout()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('CHILD PAGE')).toBeInTheDocument()
    expect(screen.getByText('Assignment Upload')).toBeInTheDocument()
  })
})
