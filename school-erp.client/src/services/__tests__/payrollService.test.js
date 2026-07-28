import { describe, it, expect, vi, beforeEach } from 'vitest'

// Chainable mock that mimics supabase-js's thenable PostgrestFilterBuilder:
// every filter method returns itself, and it resolves to `result` when awaited.
function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    lte: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    range: vi.fn(() => builder),
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
function defaultFromImpl(table) {
  return createBuilder(tableResults[table] ?? { data: null, error: null })
}
const fromMock = vi.fn(defaultFromImpl)

vi.mock('../../lib/supabaseClient', () => ({
  default: { from: (...args) => fromMock(...args) },
}))

const payrollService = await import('../payrollService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
})

// Wires a spy onto the 'payslips' table's upsert() call so the test can
// inspect the computed payload without caring about the rest of the chain.
function captureUpsertPayload() {
  let capturedPayload
  fromMock.mockImplementation((table) => {
    const builder = createBuilder(tableResults[table] ?? { data: null, error: null })
    if (table === 'payslips') {
      builder.upsert = vi.fn((rows) => {
        capturedPayload = rows[0]
        builder._resolved = { data: { id: 'p1', ...rows[0] }, error: null }
        return builder
      })
      builder.single = vi.fn(() => Promise.resolve(builder._resolved))
    }
    return builder
  })
  return () => capturedPayload
}

describe('payrollService.generatePayslip', () => {
  it('combines salary structure, allowances, deductions, PF, ESI and PT into gross/net', async () => {
    tableResults.salary_structures = {
      data: { basic: 30000, hra: 5000, da: 2000, conveyance_allowance: 0, medical_allowance: 0, special_allowance: 0 },
      error: null,
    }
    tableResults.allowances = { data: [{ amount: 1000 }, { amount: 500 }], error: null }
    tableResults.deductions = { data: [{ amount: 300 }], error: null }
    tableResults.pf_contributions = { data: { employee_contribution: 1800 }, error: null }
    tableResults.esi_contributions = { data: { employee_contribution: 200 }, error: null }
    tableResults.professional_tax = { data: { amount: 200 }, error: null }
    const getPayload = captureUpsertPayload()

    const result = await payrollService.generatePayslip({ teacher_id: 't1', month: '2026-07-01' })

    // gross = basic(30000) + hra(5000) + da(2000) + allowances(1000+500) = 38500
    // deductions = other(300) + pf(1800) + esi(200) + pt(200) = 2500
    // net = 38500 - 2500 = 36000
    expect(getPayload().gross_salary).toBe(38500)
    expect(getPayload().total_deductions).toBe(2500)
    expect(getPayload().net_salary).toBe(36000)
    expect(result).toEqual(expect.objectContaining({ id: 'p1' }))
  })

  it('defaults missing salary structure and PF/ESI/PT rows to zero', async () => {
    tableResults.salary_structures = { data: null, error: null }
    tableResults.allowances = { data: [], error: null }
    tableResults.deductions = { data: [], error: null }
    tableResults.pf_contributions = { data: null, error: null }
    tableResults.esi_contributions = { data: null, error: null }
    tableResults.professional_tax = { data: null, error: null }
    const getPayload = captureUpsertPayload()

    await payrollService.generatePayslip({ teacher_id: 't2', month: '2026-07-01' })

    expect(getPayload()).toEqual(expect.objectContaining({
      basic: 0,
      total_allowances: 0,
      total_deductions: 0,
      pf_amount: 0,
      esi_amount: 0,
      pt_amount: 0,
      gross_salary: 0,
      net_salary: 0,
    }))
  })
})

describe('payrollService CRUD', () => {
  it('getSalaryStructures returns rows', async () => {
    tableResults.salary_structures = { data: [{ id: 's1', basic: 1000 }], error: null }
    const result = await payrollService.getSalaryStructures()
    expect(result).toEqual([{ id: 's1', basic: 1000 }])
  })

  it('createBonus throws when supabase returns an error', async () => {
    tableResults.bonuses = { data: null, error: new Error('insert failed') }
    await expect(payrollService.createBonus({ teacher_id: 't1', amount: 500 })).rejects.toThrow('insert failed')
  })
})
