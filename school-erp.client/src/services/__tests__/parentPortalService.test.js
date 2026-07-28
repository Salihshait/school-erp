import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

const tableResults = {}
function defaultFromImpl(table) {
  return createBuilder(tableResults[table] ?? { data: null, error: null })
}
const fromMock = vi.fn(defaultFromImpl)

vi.mock('../../lib/supabaseClient', () => ({
  default: { from: (...args) => fromMock(...args) },
}))

const parentPortalService = await import('../parentPortalService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('parentPortalService', () => {
  it('getParentProfileByEmail resolves the parent + linked student', async () => {
    tableResults.parents = {
      data: { id: 'par1', email: 'mom@example.com', student_id: 's1', students: { id: 's1', first_name: 'Ann', last_name: 'Lee' } },
      error: null,
    }
    const result = await parentPortalService.getParentProfileByEmail('mom@example.com')
    expect(result.students.first_name).toBe('Ann')
    expect(fromMock).toHaveBeenCalledWith('parents')
  })

  it('getParentProfileByEmail returns null when no match', async () => {
    tableResults.parents = { data: null, error: null }
    const result = await parentPortalService.getParentProfileByEmail('nobody@example.com')
    expect(result).toBeNull()
  })

  it('getHomework filters by class and section when provided', async () => {
    tableResults.homework = { data: [{ id: 'h1', title: 'Math worksheet' }], error: null }
    const result = await parentPortalService.getHomework({ class_id: 'c1', section: 'A' })
    expect(result).toEqual([{ id: 'h1', title: 'Math worksheet' }])
  })

  it('sendMessage throws when supabase returns an error', async () => {
    tableResults.messages = { data: null, error: new Error('insert failed') }
    await expect(parentPortalService.sendMessage({ student_id: 's1', teacher_id: 't1', sender_type: 'parent', body: 'hi' }))
      .rejects.toThrow('insert failed')
  })

  it('markNotificationRead marks the notification as read', async () => {
    tableResults.notifications = { data: { id: 'n1', is_read: true }, error: null }
    const result = await parentPortalService.markNotificationRead('n1')
    expect(result).toEqual({ id: 'n1', is_read: true })
  })
})
