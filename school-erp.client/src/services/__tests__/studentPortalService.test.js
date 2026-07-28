import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
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

const studentPortalService = await import('../studentPortalService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

describe('studentPortalService', () => {
  it('getStudentProfileByEmail resolves the student record', async () => {
    tableResults.students = { data: { id: 's1', email: 'ann@example.com', first_name: 'Ann' }, error: null }
    const result = await studentPortalService.getStudentProfileByEmail('ann@example.com')
    expect(result.first_name).toBe('Ann')
    expect(fromMock).toHaveBeenCalledWith('students')
  })

  it('getStudentProfileByEmail returns null when no match', async () => {
    tableResults.students = { data: null, error: null }
    const result = await studentPortalService.getStudentProfileByEmail('nobody@example.com')
    expect(result).toBeNull()
  })

  it('getAssignments filters by class and section when provided', async () => {
    tableResults.assignments = { data: [{ id: 'a1', title: 'Essay' }], error: null }
    const result = await studentPortalService.getAssignments({ class_id: 'c1', section: 'A' })
    expect(result).toEqual([{ id: 'a1', title: 'Essay' }])
  })

  it('submitAssignment upserts a submission keyed by assignment + student', async () => {
    tableResults.assignment_submissions = { data: { id: 'sub1', status: 'submitted' }, error: null }
    const result = await studentPortalService.submitAssignment({ assignment_id: 'a1', student_id: 's1', content: 'my answer' })
    expect(result).toEqual({ id: 'sub1', status: 'submitted' })
  })

  it('getCertificates throws when supabase returns an error', async () => {
    tableResults.certificates = { data: null, error: new Error('query failed') }
    await expect(studentPortalService.getCertificates('s1')).rejects.toThrow('query failed')
  })

  it('createAssignment inserts and returns the created row', async () => {
    tableResults.assignments = { data: { id: 'a2', title: 'Project' }, error: null }
    const result = await studentPortalService.createAssignment({ class_id: 'c1', subject: 'Science', title: 'Project', created_by: 't1' })
    expect(result).toEqual({ id: 'a2', title: 'Project' })
    expect(fromMock).toHaveBeenCalledWith('assignments')
  })

  it('gradeSubmission marks the submission graded with the given marks', async () => {
    let capturedPayload
    fromMock.mockImplementation((table) => {
      const builder = createBuilder(tableResults[table] ?? { data: null, error: null })
      if (table === 'assignment_submissions') {
        builder.update = vi.fn((payload) => {
          capturedPayload = payload
          builder._resolved = { data: { id: 'sub1', ...payload }, error: null }
          return builder
        })
        builder.single = vi.fn(() => Promise.resolve(builder._resolved))
      }
      return builder
    })

    const result = await studentPortalService.gradeSubmission({ id: 'sub1', marks_obtained: 42 })

    expect(capturedPayload).toEqual({ marks_obtained: 42, status: 'graded' })
    expect(result).toEqual(expect.objectContaining({ id: 'sub1', marks_obtained: 42, status: 'graded' }))
  })
})
