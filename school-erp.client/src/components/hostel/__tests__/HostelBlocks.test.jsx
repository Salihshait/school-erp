import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import HostelBlocks from '../HostelBlocks'
import * as useHostelHooks from '../../../hooks/useHostel'

vi.mock('../../../hooks/useHostel')

describe('HostelBlocks', () => {
  const createMutateAsync = vi.fn().mockResolvedValue({})
  const deleteMutate = vi.fn()

  beforeEach(() => {
    createMutateAsync.mockClear()
    deleteMutate.mockClear()
    useHostelHooks.useHostelBlocks.mockReturnValue({
      data: [{ id: 'b1', name: 'Block A', warden_name: 'Mr. Rao', total_floors: 3 }],
      isLoading: false,
    })
    useHostelHooks.useCreateHostelBlock.mockReturnValue({ mutateAsync: createMutateAsync })
    useHostelHooks.useDeleteHostelBlock.mockReturnValue({ mutate: deleteMutate })
  })

  it('renders existing blocks', () => {
    render(<HostelBlocks />)
    expect(screen.getByText(/Block A/)).toBeInTheDocument()
    expect(screen.getByText(/Mr\. Rao/)).toBeInTheDocument()
  })

  it('submits a new block with the entered name', async () => {
    render(<HostelBlocks />)
    fireEvent.change(screen.getByPlaceholderText('Block name'), { target: { value: 'Block C' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Add Block'))
    })

    expect(createMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Block C' })
    )
  })

  it('does not submit when the name is blank', () => {
    render(<HostelBlocks />)
    fireEvent.click(screen.getByText('Add Block'))
    expect(createMutateAsync).not.toHaveBeenCalled()
  })

  it('deletes a block when Delete is clicked', () => {
    render(<HostelBlocks />)
    fireEvent.click(screen.getByText('Delete'))
    expect(deleteMutate).toHaveBeenCalledWith('b1')
  })
})
