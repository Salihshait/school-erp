import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ReportFilters, { filterByMonthRange } from '../ReportFilters'

describe('filterByMonthRange', () => {
  const rows = [
    { month: '2026-01-01', count: 1 },
    { month: '2026-02-01', count: 2 },
    { month: '2026-03-15', count: 3 },
  ]

  it('returns all rows when no range is given', () => {
    expect(filterByMonthRange(rows, 'month', '', '')).toHaveLength(3)
  })

  it('excludes rows before the "from" month', () => {
    const result = filterByMonthRange(rows, 'month', '2026-02', '')
    expect(result.map(r => r.count)).toEqual([2, 3])
  })

  it('excludes rows after the "to" month', () => {
    const result = filterByMonthRange(rows, 'month', '', '2026-02')
    expect(result.map(r => r.count)).toEqual([1, 2])
  })

  it('handles an empty rows array', () => {
    expect(filterByMonthRange(null, 'month', '2026-01', '2026-12')).toEqual([])
  })
})

describe('ReportFilters', () => {
  it('calls onFromChange/onToChange when the inputs change', () => {
    const onFromChange = vi.fn()
    const onToChange = vi.fn()
    render(<ReportFilters from="" to="" onFromChange={onFromChange} onToChange={onToChange} />)

    const [fromInput, toInput] = screen.getAllByDisplayValue('')
    fireEvent.change(fromInput, { target: { value: '2026-01' } })
    fireEvent.change(toInput, { target: { value: '2026-06' } })

    expect(onFromChange).toHaveBeenCalledWith('2026-01')
    expect(onToChange).toHaveBeenCalledWith('2026-06')
  })
})
