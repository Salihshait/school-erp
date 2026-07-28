import supabase from '../lib/supabaseClient'

export const createCategory = async ({ name, description }) => {
  const { data, error } = await supabase.from('book_categories').insert([{ name, description }]).select().single()
  if (error) throw error
  return data
}

export const addBook = async (payload) => {
  const { data, error } = await supabase.from('books').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const addCopy = async ({ book_id, copy_no, barcode, rfid_tag }) => {
  const { data, error } = await supabase.from('book_copies').insert([{ book_id, copy_no, barcode, rfid_tag }]).select().single()
  if (error) throw error
  return data
}

export const registerMember = async ({ person_id, person_type, membership_expires }) => {
  const { data, error } = await supabase.from('members').insert([{ person_id, person_type, membership_expires }]).select().single()
  if (error) throw error
  return data
}

export const issueBook = async ({ copy_id, member_id, due_date, issued_by }) => {
  const { data, error } = await supabase.from('issues').insert([{ copy_id, member_id, due_date, issued_by }]).select().single()
  if (error) throw error
  // update copy status
  await supabase.from('book_copies').update({ status: 'issued' }).eq('id', copy_id)
  return data
}

export const returnBook = async ({ issue_id, returned_at }) => {
  const { data: issue, error } = await supabase.from('issues').update({ status: 'returned', returned_at }).eq('id', issue_id).select().single()
  if (error) throw error
  // set copy available
  await supabase.from('book_copies').update({ status: 'available' }).eq('id', issue.copy_id)
  return issue
}

export const renewBook = async ({ issue_id, additional_days }) => {
  const { data, error } = await supabase.from('issues').select('*').eq('id', issue_id).single()
  if (error) throw error
  const newDue = new Date(data.due_date)
  newDue.setDate(newDue.getDate() + additional_days)
  const { data: updated, error: e2 } = await supabase.from('issues').update({ due_date: newDue.toISOString().slice(0,10), renewed_count: data.renewed_count + 1 }).eq('id', issue_id).select().single()
  if (e2) throw e2
  return updated
}

export const reserveBook = async ({ book_id, member_id, expires_at }) => {
  const { data, error } = await supabase.from('reservations').insert([{ book_id, member_id, expires_at }]).select().single()
  if (error) throw error
  return data
}

export const getBookHistory = async ({ person_id }) => {
  const { data, error } = await supabase.rpc('get_book_history', { _person_id: person_id })
  if (error) {
    // fallback: simple join
    const fallback = await supabase.from('issues').select('*').eq('member_id', person_id)
    return fallback.data
  }
  return data
}

export const searchBooks = async (q) => {
  const { data, error } = await supabase.from('books').select('*').ilike('title', `%${q}%`).limit(50)
  if (error) throw error
  return data
}

export const addFine = async ({ issue_id, amount, reason }) => {
  const { data, error } = await supabase.from('fines').insert([{ issue_id, amount, reason }]).select().single()
  if (error) throw error
  return data
}
