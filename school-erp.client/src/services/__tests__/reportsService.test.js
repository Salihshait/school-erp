import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
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

const reportsService = await import('../reportsService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('reportsService', () => {
  it('getAdmissionsMonthly returns rows from the admissions_monthly view', async () => {
    tableResults.admissions_monthly = { data: [{ month: '2026-01-01', count: 5 }], error: null }
    const result = await reportsService.getAdmissionsMonthly()
    expect(result).toEqual([{ month: '2026-01-01', count: 5 }])
    expect(fromMock).toHaveBeenCalledWith('admissions_monthly')
  })

  it('getExamPerformance throws when supabase returns an error', async () => {
    tableResults.exam_performance_summary = { data: null, error: new Error('query failed') }
    await expect(reportsService.getExamPerformance()).rejects.toThrow('query failed')
  })

  it('getBookIssueSummary returns rows from the book_issue_summary view', async () => {
    tableResults.book_issue_summary = { data: [{ book_id: 'b1', title: 'Novel', total_issues: 3 }], error: null }
    const result = await reportsService.getBookIssueSummary()
    expect(result).toEqual([{ book_id: 'b1', title: 'Novel', total_issues: 3 }])
  })

  it('getTeacherPerformanceSummary returns rows from the teacher_performance_summary view', async () => {
    tableResults.teacher_performance_summary = { data: [{ teacher_id: 't1', avg_score: 4.5, reviews_count: 2 }], error: null }
    const result = await reportsService.getTeacherPerformanceSummary()
    expect(result).toEqual([{ teacher_id: 't1', avg_score: 4.5, reviews_count: 2 }])
  })
})
