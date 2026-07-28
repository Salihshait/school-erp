import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
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

const { getClassTimetable, getTeacherTimetable } = await import('../teacherService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('teacherService timetable getters', () => {
  it('getClassTimetable filters teacher_timetable by class_id', async () => {
    tableResults.teacher_timetable = { data: [{ id: 'tt1', class_id: 'c1', subject: 'Math' }], error: null }
    const result = await getClassTimetable('c1')
    expect(result).toEqual([{ id: 'tt1', class_id: 'c1', subject: 'Math' }])
    expect(fromMock).toHaveBeenCalledWith('teacher_timetable')
  })

  it('getTeacherTimetable filters teacher_timetable by teacher_id', async () => {
    tableResults.teacher_timetable = { data: [{ id: 'tt2', teacher_id: 't1', subject: 'Science' }], error: null }
    const result = await getTeacherTimetable('t1')
    expect(result).toEqual([{ id: 'tt2', teacher_id: 't1', subject: 'Science' }])
  })

  it('getTeacherTimetable throws when supabase returns an error', async () => {
    tableResults.teacher_timetable = { data: null, error: new Error('query failed') }
    await expect(getTeacherTimetable('t1')).rejects.toThrow('query failed')
  })
})
