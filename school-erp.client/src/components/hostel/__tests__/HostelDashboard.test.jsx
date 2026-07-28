import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HostelDashboard from '../HostelDashboard'
import * as useHostelHooks from '../../../hooks/useHostel'

vi.mock('../../../hooks/useHostel')

describe('HostelDashboard', () => {
  beforeEach(() => {
    useHostelHooks.useRoomOccupancy.mockReturnValue({
      data: [
        { room_id: 'r1', occupied_beds: 3, vacant_beds: 1 },
        { room_id: 'r2', occupied_beds: 2, vacant_beds: 2 },
      ],
      isLoading: false,
    })
    useHostelHooks.useHostelFeeSummary.mockReturnValue({
      data: [{ status: 'pending', count: 4 }, { status: 'paid', count: 10 }],
      isLoading: false,
    })
    useHostelHooks.useComplaints.mockReturnValue({
      data: [{ id: 'c1' }, { id: 'c2' }],
      isLoading: false,
    })
    useHostelHooks.useVisitors.mockReturnValue({
      data: [{ id: 'v1', check_out: null }, { id: 'v2', check_out: '2026-01-01T00:00:00Z' }],
      isLoading: false,
    })
  })

  it('aggregates bed occupancy across rooms', () => {
    render(<HostelDashboard />)
    expect(screen.getByText('5/8')).toBeInTheDocument()
  })

  it('shows pending fee count, open complaint count, and visitors currently in hostel', () => {
    render(<HostelDashboard />)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
