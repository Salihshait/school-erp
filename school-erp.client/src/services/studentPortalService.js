import supabase from '../lib/supabaseClient'

// Student profile resolution (student auth is Supabase auth + email match against `students`)
export const getStudentProfileByEmail = async (email) => {
  const { data, error } = await supabase.from('students').select('*').eq('email', email).maybeSingle()
  if (error) throw error
  return data
}

// Assignments
export const getAssignments = async ({ class_id, section } = {}) => {
  let q = supabase.from('assignments').select('*').order('due_date', { ascending: true })
  if (class_id) q = q.eq('class_id', class_id)
  if (section) q = q.eq('section', section)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const getSubmissions = async ({ student_id }) => {
  const { data, error } = await supabase.from('assignment_submissions').select('*').eq('student_id', student_id)
  if (error) throw error
  return data
}

export const submitAssignment = async (payload) => {
  const { data, error } = await supabase.from('assignment_submissions')
    .upsert([payload], { onConflict: 'assignment_id,student_id' }).select().single()
  if (error) throw error
  return data
}

// Download Notes
export const getStudyNotes = async ({ class_id, section } = {}) => {
  let q = supabase.from('study_notes').select('*').order('uploaded_at', { ascending: false })
  if (class_id) q = q.eq('class_id', class_id)
  if (section) q = q.eq('section', section)
  const { data, error } = await q
  if (error) throw error
  return data
}

// Certificates
export const getCertificates = async (student_id) => {
  const { data, error } = await supabase.from('certificates').select('*')
    .eq('student_id', student_id).order('issued_date', { ascending: false })
  if (error) throw error
  return data
}
