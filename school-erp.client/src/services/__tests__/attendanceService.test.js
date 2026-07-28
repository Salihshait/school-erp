import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
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
  supabase: { from: (...args) => fromMock(...args) },
  default: { from: (...args) => fromMock(...args) },
}))

const { getAttendanceOverview } = await import('../attendanceService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('attendanceService.getAttendanceOverview', () => {
  it('sums present/absent counts across people for the same month', async () => {
    tableResults.attendance_monthly_summary = {
      data: [
        { month: '2026-01-01', person_id: 's1', present_count: 20, absent_count: 2, total_records: 22 },
        { month: '2026-01-01', person_id: 's2', present_count: 18, absent_count: 4, total_records: 22 },
        { month: '2026-02-01', person_id: 's1', present_count: 19, absent_count: 3, total_records: 22 },
      ],
      error: null,
    }

    const result = await getAttendanceOverview({ person_type: 'student' })

    expect(result).toEqual([
      { month: '2026-01-01', present_count: 38, absent_count: 6, total_records: 44 },
      { month: '2026-02-01', present_count: 19, absent_count: 3, total_records: 22 },
    ])
  })

  it('returns an empty array when there are no records', async () => {
    tableResults.attendance_monthly_summary = { data: [], error: null }
    const result = await getAttendanceOverview({ person_type: 'teacher' })
    expect(result).toEqual([])
  })

  it('throws when supabase returns an error', async () => {
    tableResults.attendance_monthly_summary = { data: null, error: new Error('query failed') }
    await expect(getAttendanceOverview({ person_type: 'student' })).rejects.toThrow('query failed')
  })
})
