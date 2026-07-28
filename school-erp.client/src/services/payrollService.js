import supabase from '../lib/supabaseClient'

function sum(rows, key) {
  return (rows || []).reduce((total, row) => total + (Number(row[key]) || 0), 0)
}

// Salary Structure
export const getSalaryStructures = async ({ teacher_id } = {}) => {
  let q = supabase.from('salary_structures').select('*').order('effective_from', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createSalaryStructure = async (payload) => {
  const { data, error } = await supabase.from('salary_structures').insert([payload]).select().single()
  if (error) throw error
  return data
}

async function getLatestSalaryStructure(teacher_id, month) {
  const { data, error } = await supabase.from('salary_structures')
    .select('*')
    .eq('teacher_id', teacher_id)
    .lte('effective_from', month)
    .order('effective_from', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

async function getSingleForMonth(table, teacher_id, month) {
  const { data, error } = await supabase.from(table).select('*')
    .eq('teacher_id', teacher_id).eq('month', month).maybeSingle()
  if (error) throw error
  return data
}

// Allowance
export const getAllowances = async ({ teacher_id, month } = {}) => {
  let q = supabase.from('allowances').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  if (month) q = q.eq('month', month)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createAllowance = async (payload) => {
  const { data, error } = await supabase.from('allowances').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const deleteAllowance = async (id) => {
  const { error } = await supabase.from('allowances').delete().eq('id', id)
  if (error) throw error
  return true
}

// Deduction
export const getDeductions = async ({ teacher_id, month } = {}) => {
  let q = supabase.from('deductions').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  if (month) q = q.eq('month', month)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createDeduction = async (payload) => {
  const { data, error } = await supabase.from('deductions').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const deleteDeduction = async (id) => {
  const { error } = await supabase.from('deductions').delete().eq('id', id)
  if (error) throw error
  return true
}

// PF
export const getPfContributions = async ({ teacher_id } = {}) => {
  let q = supabase.from('pf_contributions').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const upsertPfContribution = async (payload) => {
  const { data, error } = await supabase.from('pf_contributions')
    .upsert([payload], { onConflict: 'teacher_id,month' }).select().single()
  if (error) throw error
  return data
}

// ESI
export const getEsiContributions = async ({ teacher_id } = {}) => {
  let q = supabase.from('esi_contributions').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const upsertEsiContribution = async (payload) => {
  const { data, error } = await supabase.from('esi_contributions')
    .upsert([payload], { onConflict: 'teacher_id,month' }).select().single()
  if (error) throw error
  return data
}

// Professional Tax
export const getProfessionalTax = async ({ teacher_id } = {}) => {
  let q = supabase.from('professional_tax').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const upsertProfessionalTax = async (payload) => {
  const { data, error } = await supabase.from('professional_tax')
    .upsert([payload], { onConflict: 'teacher_id,month' }).select().single()
  if (error) throw error
  return data
}

// Loan
export const getLoans = async ({ teacher_id } = {}) => {
  let q = supabase.from('loans').select('*').order('created_at', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createLoan = async (payload) => {
  const { data, error } = await supabase.from('loans').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const closeLoan = async (id) => {
  const { data, error } = await supabase.from('loans').update({ status: 'closed' }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const getLoanRepayments = async ({ loan_id } = {}) => {
  let q = supabase.from('loan_repayments').select('*').order('repayment_month', { ascending: false })
  if (loan_id) q = q.eq('loan_id', loan_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const recordLoanRepayment = async (payload) => {
  const { data, error } = await supabase.from('loan_repayments').insert([payload]).select().single()
  if (error) throw error
  return data
}

// Advance Salary
export const getAdvanceSalaries = async ({ teacher_id } = {}) => {
  let q = supabase.from('advance_salary').select('*').order('requested_date', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const requestAdvanceSalary = async (payload) => {
  const { data, error } = await supabase.from('advance_salary').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const updateAdvanceSalaryStatus = async (id, status) => {
  const { data, error } = await supabase.from('advance_salary').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Bonus
export const getBonuses = async ({ teacher_id } = {}) => {
  let q = supabase.from('bonuses').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createBonus = async (payload) => {
  const { data, error } = await supabase.from('bonuses').insert([payload]).select().single()
  if (error) throw error
  return data
}

// Payslip
export const getPayslips = async ({ teacher_id, month } = {}) => {
  let q = supabase.from('payslips').select('*').order('month', { ascending: false })
  if (teacher_id) q = q.eq('teacher_id', teacher_id)
  if (month) q = q.eq('month', month)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function generatePayslip({ teacher_id, month }) {
  const structure = await getLatestSalaryStructure(teacher_id, month)
  const basic = structure?.basic || 0
  const fixedAllowances = (structure?.hra || 0) + (structure?.da || 0)
    + (structure?.conveyance_allowance || 0) + (structure?.medical_allowance || 0)
    + (structure?.special_allowance || 0)

  const [allowanceRows, deductionRows, pf, esi, pt] = await Promise.all([
    getAllowances({ teacher_id, month }),
    getDeductions({ teacher_id, month }),
    getSingleForMonth('pf_contributions', teacher_id, month),
    getSingleForMonth('esi_contributions', teacher_id, month),
    getSingleForMonth('professional_tax', teacher_id, month),
  ])

  const totalAllowances = fixedAllowances + sum(allowanceRows, 'amount')
  const otherDeductions = sum(deductionRows, 'amount')
  const pfAmount = pf?.employee_contribution || 0
  const esiAmount = esi?.employee_contribution || 0
  const ptAmount = pt?.amount || 0
  const totalDeductions = otherDeductions + pfAmount + esiAmount + ptAmount

  const grossSalary = basic + totalAllowances
  const netSalary = grossSalary - totalDeductions

  const payload = {
    teacher_id,
    month,
    basic,
    total_allowances: totalAllowances,
    total_deductions: totalDeductions,
    pf_amount: pfAmount,
    esi_amount: esiAmount,
    pt_amount: ptAmount,
    gross_salary: grossSalary,
    net_salary: netSalary,
    status: 'generated',
    generated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('payslips')
    .upsert([payload], { onConflict: 'teacher_id,month' }).select().single()
  if (error) throw error
  return data
}

// Reports
export const getPayrollSummary = async () => {
  const { data, error } = await supabase.from('payroll_summary').select('*')
  if (error) throw error
  return data
}
