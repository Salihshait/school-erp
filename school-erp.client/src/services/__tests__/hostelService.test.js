import { describe, it, expect, vi, beforeEach } from 'vitest'

// Chainable mock that mimics supabase-js's thenable PostgrestFilterBuilder:
// every filter method returns itself, and it resolves to `result` when awaited.
function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    range: vi.fn(() => builder),
    textSearch: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

const tableResults = {}
const fromMock = vi.fn((table) => createBuilder(tableResults[table] ?? { data: null, error: null }))

vi.mock('../../lib/supabaseClient', () => ({
  default: { from: (...args) => fromMock(...args) },
}))

const hostelService = await import('../hostelService')

beforeEach(() => {
  fromMock.mockClear()
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('hostelService', () => {
  it('getBlocks returns data on success', async () => {
    tableResults.hostel_blocks = { data: [{ id: '1', name: 'Block A' }], error: null }
    const result = await hostelService.getBlocks()
    expect(result).toEqual([{ id: '1', name: 'Block A' }])
    expect(fromMock).toHaveBeenCalledWith('hostel_blocks')
  })

  it('getBlocks throws when supabase returns an error', async () => {
    tableResults.hostel_blocks = { data: null, error: new Error('boom') }
    await expect(hostelService.getBlocks()).rejects.toThrow('boom')
  })

  it('createBlock inserts and returns the created row', async () => {
    tableResults.hostel_blocks = { data: { id: '2', name: 'Block B' }, error: null }
    const result = await hostelService.createBlock({ name: 'Block B' })
    expect(result).toEqual({ id: '2', name: 'Block B' })
  })

  it('allocateRoom creates an allocation and marks the bed occupied', async () => {
    tableResults.room_allocations = { data: { id: 'a1', bed_id: 'b1', student_id: 's1' }, error: null }
    tableResults.beds = { data: { id: 'b1', status: 'occupied' }, error: null }

    const result = await hostelService.allocateRoom({ bed_id: 'b1', student_id: 's1' })

    expect(result).toEqual({ id: 'a1', bed_id: 'b1', student_id: 's1' })
    expect(fromMock).toHaveBeenCalledWith('room_allocations')
    expect(fromMock).toHaveBeenCalledWith('beds')
  })

  it('updateComplaintStatus stamps resolved_at when resolving', async () => {
    let capturedPayload
    fromMock.mockImplementationOnce(() => {
      const builder = createBuilder({ data: { id: 'c1', status: 'resolved' }, error: null })
      builder.update = vi.fn((payload) => {
        capturedPayload = payload
        return builder
      })
      return builder
    })

    await hostelService.updateComplaintStatus('c1', 'resolved')

    expect(capturedPayload.status).toBe('resolved')
    expect(capturedPayload.resolved_at).toBeDefined()
  })
})
