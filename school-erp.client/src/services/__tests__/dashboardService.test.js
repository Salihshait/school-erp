import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    not: vi.fn(() => builder),
    in: vi.fn(() => builder),
    gte: vi.fn(() => builder),
    lte: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
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

const dashboardService = await import('../dashboardService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('dashboardService counts', () => {
  it('getStudentCount returns the row count', async () => {
    tableResults.students = { count: 42, error: null }
    const result = await dashboardService.getStudentCount()
    expect(result).toBe(42)
  })

  it('getStudentCount defaults to 0 when count is null', async () => {
    tableResults.students = { count: null, error: null }
    const result = await dashboardService.getStudentCount()
    expect(result).toBe(0)
  })

  it('getClassCount counts distinct class_id values', async () => {
    tableResults.students = {
      data: [{ class_id: 'c1' }, { class_id: 'c1' }, { class_id: 'c2' }],
      error: null,
    }
    const result = await dashboardService.getClassCount()
    expect(result).toBe(2)
  })
})

describe('dashboardService.getTodayAttendanceSummary', () => {
  it('returns zeroed summary when there are no sessions today', async () => {
    tableResults.attendance_sessions = { data: [], error: null }
    const result = await dashboardService.getTodayAttendanceSummary()
    expect(result).toEqual({ present: 0, absent: 0, total: 0 })
  })

  it('counts present/absent across today\'s sessions', async () => {
    tableResults.attendance_sessions = { data: [{ id: 'sess1' }], error: null }
    tableResults.attendance_records = {
      data: [{ status: 'present' }, { status: 'present' }, { status: 'absent' }],
      error: null,
    }
    const result = await dashboardService.getTodayAttendanceSummary()
    expect(result).toEqual({ present: 2, absent: 1, total: 3 })
  })
})

describe('dashboardService.getTodaysBirthdays', () => {
  it('filters students whose birthday is today', async () => {
    const today = new Date()
    const todayIso = `2000-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    tableResults.students = {
      data: [
        { id: 's1', first_name: 'Ann', last_name: 'Lee', dob: todayIso },
        { id: 's2', first_name: 'Bob', last_name: 'Ray', dob: '1999-01-01' },
      ],
      error: null,
    }
    const result = await dashboardService.getTodaysBirthdays()
    expect(result).toEqual([{ id: 's1', first_name: 'Ann', last_name: 'Lee', dob: todayIso }])
  })
})

describe('dashboardService.getRecentAdmissions', () => {
  it('maps admissions to their student names', async () => {
    tableResults.admissions = {
      data: [{ id: 'a1', student_id: 's1', admission_date: '2026-01-01' }],
      error: null,
    }
    tableResults.students = {
      data: [{ id: 's1', first_name: 'Ann', last_name: 'Lee' }],
      error: null,
    }
    const result = await dashboardService.getRecentAdmissions(5)
    expect(result).toEqual([{ id: 'a1', student_id: 's1', admission_date: '2026-01-01', student_name: 'Ann Lee' }])
  })

  it('returns an empty array when there are no admissions', async () => {
    tableResults.admissions = { data: [], error: null }
    const result = await dashboardService.getRecentAdmissions(5)
    expect(result).toEqual([])
  })
})

describe('dashboardService.getMonthlyFinance', () => {
  it('combines the latest monthly collection with summed expenses', async () => {
    tableResults.monthly_collection = { data: [{ month: '2026-07-01', total: 5000 }], error: null }
    tableResults.expenses = { data: [{ amount: 1000 }, { amount: 500 }], error: null }
    const result = await dashboardService.getMonthlyFinance()
    expect(result).toEqual({ income: 5000, expenses: 1500 })
  })

  it('defaults to zero when there is no data yet', async () => {
    tableResults.monthly_collection = { data: [], error: null }
    tableResults.expenses = { data: [], error: null }
    const result = await dashboardService.getMonthlyFinance()
    expect(result).toEqual({ income: 0, expenses: 0 })
  })
})
