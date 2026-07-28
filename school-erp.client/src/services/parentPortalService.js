import supabase from '../lib/supabaseClient'

// Parent profile resolution (parent auth is Supabase auth + email match against `parents`)
export const getParentProfileByEmail = async (email) => {
  const { data, error } = await supabase.from('parents').select('*, students(*)').eq('email', email).maybeSingle()
  if (error) throw error
  return data
}

// Homework
export const getHomework = async ({ class_id, section } = {}) => {
  let q = supabase.from('homework').select('*').order('due_date', { ascending: true })
  if (class_id) q = q.eq('class_id', class_id)
  if (section) q = q.eq('section', section)
  const { data, error } = await q
  if (error) throw error
  return data
}

// Notice Board
export const getNotices = async () => {
  const { data, error } = await supabase.from('notices').select('*').order('posted_at', { ascending: false })
  if (error) throw error
  return data
}

// School Events
export const getEvents = async () => {
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true })
  if (error) throw error
  return data
}

// Teacher Chat
export const getMessages = async ({ student_id, teacher_id }) => {
  const { data, error } = await supabase.from('messages').select('*')
    .eq('student_id', student_id).eq('teacher_id', teacher_id)
    .order('sent_at', { ascending: true })
  if (error) throw error
  return data
}

export const sendMessage = async (payload) => {
  const { data, error } = await supabase.from('messages').insert([payload]).select().single()
  if (error) throw error
  return data
}

// Notifications
export const getNotifications = async ({ parent_id }) => {
  const { data, error } = await supabase.from('notifications').select('*')
    .eq('parent_id', parent_id).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const markNotificationRead = async (id) => {
  const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id).select().single()
  if (error) throw error
  return data
}
