import supabase from '../lib/supabaseClient'

export const createCategory = async ({ name, description }) => {
  const { data, error } = await supabase.from('fee_categories').insert([{ name, description }]).select().single()
  if (error) throw error
  return data
}

export const getCategories = async () => {
  const { data, error } = await supabase.from('fee_categories').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export const createFee = async (payload) => {
  const { data, error } = await supabase.from('fees').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getPendingFees = async ({ student_id } = {}) => {
  let q = supabase.from('fees').select('*').eq('status','pending')
  if (student_id) q = q.eq('student_id', student_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const recordPayment = async (payload) => {
  const { data, error } = await supabase.from('payments').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const payFee = async ({ fee_id, student_id, amount, method = 'upi' }) => {
  const payment = await recordPayment({ fee_id, student_id, amount, method, status: 'completed' })
  const { error } = await supabase.from('fees').update({ status: 'paid' }).eq('id', fee_id)
  if (error) throw error
  return payment
}

export const getPayments = async ({ student_id }) => {
  let q = supabase.from('payments').select('*').order('collected_at', { ascending: false })
  if (student_id) q = q.eq('student_id', student_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createInstallment = async (payload) => {
  const { data, error } = await supabase.from('installments').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getDailyCollection = async () => {
  const { data, error } = await supabase.from('daily_collection').select('*')
  if (error) throw error
  return data
}

export const getMonthlyCollection = async () => {
  const { data, error } = await supabase.from('monthly_collection').select('*')
  if (error) throw error
  return data
}

export const refundPayment = async ({ payment_id, amount }) => {
  const { data, error } = await supabase.from('payments').update({ status: 'refunded', note: `Refunded ${amount}` }).eq('id', payment_id).select().single()
  if (error) throw error
  return data
}
