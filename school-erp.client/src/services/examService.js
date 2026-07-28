import supabase from '../lib/supabaseClient'

export const createExamType = async ({ name, description }) => {
  const { data, error } = await supabase.from('exam_types').insert([{ name, description }]).select().single()
  if (error) throw error
  return data
}

export const createExam = async (payload) => {
  const { data, error } = await supabase.from('exams').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getExams = async () => {
  const { data, error } = await supabase.from('exams').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addQuestion = async (payload) => {
  const { data, error } = await supabase.from('questions').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const generateQuestionPaper = async ({ exam_id, file_url }) => {
  const { data, error } = await supabase.from('question_papers').insert([{ exam_id, file_url }]).select().single()
  if (error) throw error
  return data
}

export const enterMarks = async (payload) => {
  // payload: { exam_id, student_id, subject_id, marks_obtained, max_marks }
  const { data, error } = await supabase.from('marks').insert([payload])
  if (error) throw error
  return data
}

export const calculateGrades = async ({ exam_id }) => {
  // Placeholder: recommend implementing server-side function to compute grades and cgpa
  const { data, error } = await supabase.from('marks').select('*').eq('exam_id', exam_id)
  if (error) throw error
  return data
}

export const publishResults = async ({ exam_id, published_by, notes }) => {
  const { data, error } = await supabase.from('published_results').insert([{ exam_id, published_by, notes }]).select().single()
  if (error) throw error
  return data
}

export const generateHallTicket = async ({ exam_id, student_id, ticket_url }) => {
  const { data, error } = await supabase.from('hall_tickets').insert([{ exam_id, student_id, ticket_url }]).select().single()
  if (error) throw error
  return data
}

export const getExamSchedule = async (exam_id) => {
  const { data, error } = await supabase.from('exam_schedule').select('*').eq('exam_id', exam_id).order('start_time', { ascending: true })
  if (error) throw error
  return data
}

export const getProgressCard = async ({ student_id, exam_id }) => {
  const { data, error } = await supabase.from('progress_cards').select('*').eq('student_id', student_id).eq('exam_id', exam_id)
  if (error) throw error
  return data
}

export const getStudentMarks = async (student_id) => {
  const { data, error } = await supabase.from('marks').select('*').eq('student_id', student_id)
  if (error) throw error
  return data
}

export const getClassResultSummary = async () => {
  const { data, error } = await supabase.from('class_result_summary').select('*')
  if (error) throw error
  return data
}
