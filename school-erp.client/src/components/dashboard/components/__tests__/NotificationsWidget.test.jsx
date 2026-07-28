import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotificationsWidget from '../NotificationsWidget'
import { usePendingFees } from '../../../../hooks/useFees'
import { useTodaysBirthdays, useRecentAdmissions } from '../../../../hooks/useDashboard'

vi.mock('../../../../hooks/useFees')
vi.mock('../../../../hooks/useDashboard')

describe('NotificationsWidget', () => {
  beforeEach(() => {
    usePendingFees.mockReturnValue({ data: [], isLoading: false })
    useTodaysBirthdays.mockReturnValue({ data: [], isLoading: false })
    useRecentAdmissions.mockReturnValue({ data: [], isLoading: false })
  })

  it('shows an empty state when there is nothing to notify about', () => {
    render(<NotificationsWidget />)
    expect(screen.getByText(/No new notifications/)).toBeInTheDocument()
  })

  it('surfaces a pending fees notification with the correct count', () => {
    usePendingFees.mockReturnValue({ data: [{ id: 'f1' }, { id: 'f2' }], isLoading: false })
    render(<NotificationsWidget />)
    expect(screen.getByText('2 pending fee payments')).toBeInTheDocument()
  })

  it('uses singular phrasing for a single birthday', () => {
    useTodaysBirthdays.mockReturnValue({ data: [{ id: 's1' }], isLoading: false })
    render(<NotificationsWidget />)
    expect(screen.getByText('1 birthday today')).toBeInTheDocument()
  })

  it('only counts admissions from within the last week', () => {
    const now = Date.now()
    useRecentAdmissions.mockReturnValue({
      data: [
        { id: 'a1', admission_date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'a2', admission_date: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      isLoading: false,
    })
    render(<NotificationsWidget />)
    expect(screen.getByText('1 new admission this week')).toBeInTheDocument()
  })
})
