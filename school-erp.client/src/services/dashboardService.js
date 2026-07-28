import supabase from '../lib/supabaseClient'

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10)
}

// Total Students / Teachers / Classes
export const getStudentCount = async () => {
  const { count, error } = await supabase.from('students').select('*', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
}

export const getTeacherCount = async () => {
  const { count, error } = await supabase.from('teachers').select('*', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
}

export const getClassCount = async () => {
  const { data, error } = await supabase.from('students').select('class_id').not('class_id', 'is', null)
  if (error) throw error
  return new Set((data || []).map(r => r.class_id)).size
}

// Today's Attendance
export const getTodayAttendanceSummary = async () => {
  const today = new Date().toISOString().slice(0, 10)
  const { data: sessions, error: sessionsError } = await supabase.from('attendance_sessions')
    .select('id').eq('session_date', today).eq('session_type', 'student')
  if (sessionsError) throw sessionsError

  const sessionIds = (sessions || []).map(s => s.id)
  if (sessionIds.length === 0) return { present: 0, absent: 0, total: 0 }

  const { data: records, error: recordsError } = await supabase.from('attendance_records')
    .select('status').in('session_id', sessionIds)
  if (recordsError) throw recordsError

  const present = (records || []).filter(r => r.status === 'present').length
  const absent = (records || []).filter(r => r.status === 'absent').length
  return { present, absent, total: (records || []).length }
}

// Today's Birthdays
export const getTodaysBirthdays = async () => {
  const { data, error } = await supabase.from('students').select('id, first_name, last_name, dob').not('dob', 'is', null)
  if (error) throw error
  // Compare the "MM-DD" substring directly rather than parsing `dob` with
  // `new Date`, which treats a date-only string as UTC midnight and can
  // shift the local month/day by one in timezones behind UTC.
  const today = new Date()
  const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return (data || []).filter(s => String(s.dob).slice(5, 10) === todayMonthDay)
}

// Recent Admissions
export const getRecentAdmissions = async (limit = 5) => {
  const { data: admissions, error } = await supabase.from('admissions')
    .select('*').order('admission_date', { ascending: false }).limit(limit)
  if (error) throw error

  const studentIds = [...new Set((admissions || []).map(a => a.student_id))]
  if (studentIds.length === 0) return []

  const { data: students, error: studentsError } = await supabase.from('students')
    .select('id, first_name, last_name').in('id', studentIds)
  if (studentsError) throw studentsError

  const nameById = new Map((students || []).map(s => [s.id, `${s.first_name} ${s.last_name}`]))
  return admissions.map(a => ({ ...a, student_name: nameById.get(a.student_id) || a.student_id }))
}

// Recent Notices
export const getRecentNotices = async (limit = 5) => {
  const { data, error } = await supabase.from('notices')
    .select('*').order('posted_at', { ascending: false }).limit(limit)
  if (error) throw error
  return data
}

// Income / Expenses
export const getMonthlyFinance = async () => {
  const month = startOfMonth()

  const { data: collection, error: collectionError } = await supabase.from('monthly_collection')
    .select('*').order('month', { ascending: false }).limit(1)
  if (collectionError) throw collectionError

  const { data: expenseRows, error: expensesError } = await supabase.from('expenses')
    .select('amount').gte('expense_date', month)
  if (expensesError) throw expensesError

  const income = collection?.[0]?.total || 0
  const expenses = (expenseRows || []).reduce((total, row) => total + (Number(row.amount) || 0), 0)
  return { income, expenses }
}

export const getExpenses = async (limit = 5) => {
  const { data, error } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false }).limit(limit)
  if (error) throw error
  return data
}

export const createExpense = async (payload) => {
  const { data, error } = await supabase.from('expenses').insert([payload]).select().single()
  if (error) throw error
  return data
}

// Calendar (events + holidays for a given YYYY-MM month)
export const getCalendarEntries = async (month) => {
  const [eventsRes, holidaysRes] = await Promise.all([
    supabase.from('events').select('*'),
    supabase.from('attendance_holidays').select('*'),
  ])
  if (eventsRes.error) throw eventsRes.error
  if (holidaysRes.error) throw holidaysRes.error

  const events = (eventsRes.data || [])
    .filter(e => String(e.event_date).startsWith(month))
    .map(e => ({ date: e.event_date, type: 'event', title: e.title }))
  const holidays = (holidaysRes.data || [])
    .filter(h => String(h.holiday_date).startsWith(month))
    .map(h => ({ date: h.holiday_date, type: 'holiday', title: h.title }))

  return [...events, ...holidays].sort((a, b) => a.date.localeCompare(b.date))
}
