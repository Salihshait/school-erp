import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
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

const teacherPortalService = await import('../teacherPortalService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('teacherPortalService.getTeacherProfileByEmail', () => {
  it('resolves the teacher record', async () => {
    tableResults.teachers = { data: { id: 't1', email: 'jane@example.com', first_name: 'Jane' }, error: null }
    const result = await teacherPortalService.getTeacherProfileByEmail('jane@example.com')
    expect(result.first_name).toBe('Jane')
    expect(fromMock).toHaveBeenCalledWith('teachers')
  })

  it('returns null when no match', async () => {
    tableResults.teachers = { data: null, error: null }
    const result = await teacherPortalService.getTeacherProfileByEmail('nobody@example.com')
    expect(result).toBeNull()
  })

  it('throws when supabase returns an error', async () => {
    tableResults.teachers = { data: null, error: new Error('query failed') }
    await expect(teacherPortalService.getTeacherProfileByEmail('jane@example.com')).rejects.toThrow('query failed')
  })
})
