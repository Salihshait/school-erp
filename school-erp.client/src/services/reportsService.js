import supabase from '../lib/supabaseClient'

// Admissions report
export const getAdmissionsMonthly = async () => {
  const { data, error } = await supabase.from('admissions_monthly').select('*')
  if (error) throw error
  return data
}

// Exams report
export const getExamPerformance = async () => {
  const { data, error } = await supabase.from('exam_performance_summary').select('*')
  if (error) throw error
  return data
}

// Library report
export const getBookIssueSummary = async () => {
  const { data, error } = await supabase.from('book_issue_summary').select('*')
  if (error) throw error
  return data
}

// Teacher Performance report
export const getTeacherPerformanceSummary = async () => {
  const { data, error } = await supabase.from('teacher_performance_summary').select('*')
  if (error) throw error
  return data
}
