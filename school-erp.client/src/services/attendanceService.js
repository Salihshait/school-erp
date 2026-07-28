import supabase from '../lib/supabaseClient'

export const createSession = async ({ session_date, session_type, note, created_by }) => {
  const { data, error } = await supabase.from('attendance_sessions').insert([{ session_date, session_type, note, created_by }]).select().single()
  if (error) throw error
  return data
}

export const recordAttendance = async ({ session_id, person_id, person_type, status, recorded_by, rfid_tag, qr_code, note }) => {
  const { data, error } = await supabase.from('attendance_records').insert([{ session_id, person_id, person_type, status, recorded_by, rfid_tag, qr_code, note }]).select().single()
  if (error) throw error
  return data
}

export const bulkRecordAttendance = async (records = []) => {
  // records: [{session_id, person_id, person_type, status, recorded_by}]
  const { data, error } = await supabase.from('attendance_records').insert(records)
  if (error) throw error
  return data
}

export const getSessionRecords = async (session_id) => {
  const { data, error } = await supabase.from('attendance_records').select('*').eq('session_id', session_id)
  if (error) throw error
  return data
}

export const getPersonRecords = async ({ person_id, person_type }) => {
  const { data, error } = await supabase.from('attendance_records')
    .select('*').eq('person_id', person_id).eq('person_type', person_type)
    .order('recorded_at', { ascending: false })
  if (error) throw error
  return data
}

export const getMonthlyReport = async ({ person_id, person_type, month }) => {
  // month in YYYY-MM format
  const start = `${month}-01`
  const { data, error } = await supabase.rpc('attendance_monthly_report', { _person_id: person_id, _person_type: person_type, _month_start: start })
  // Note: rpc function optional — if not present, use view
  if (error) {
    // fallback: query view
    const fallback = await supabase.from('attendance_monthly_summary').select('*').eq('person_id', person_id).gte('month', start)
    return fallback.data
  }
  return data
}

export const createLeaveRequest = async (payload) => {
  const { data, error } = await supabase.from('attendance_leaves').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getLeaveRequests = async ({ person_id, person_type } = {}) => {
  let q = supabase.from('attendance_leaves').select('*').order('requested_at', { ascending: false })
  if (person_id) q = q.eq('person_id', person_id)
  if (person_type) q = q.eq('person_type', person_type)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const getHolidays = async () => {
  const { data, error } = await supabase.from('attendance_holidays').select('*').order('holiday_date', { ascending: true })
  if (error) throw error
  return data
}

export const getAttendanceOverview = async ({ person_type = 'student' } = {}) => {
  const { data, error } = await supabase.from('attendance_monthly_summary').select('*').eq('person_type', person_type)
  if (error) throw error
  const byMonth = new Map()
  for (const row of data || []) {
    const key = row.month
    const entry = byMonth.get(key) || { month: key, present_count: 0, absent_count: 0, total_records: 0 }
    entry.present_count += row.present_count || 0
    entry.absent_count += row.absent_count || 0
    entry.total_records += row.total_records || 0
    byMonth.set(key, entry)
  }
  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month))
}

export const exportAttendanceCsv = async (query) => {
  // lightweight: fetch records and return CSV rows (caller handles saving)
  const { data, error } = await supabase.from('attendance_records').select('*').limit(10000)
  if (error) throw error
  return data
}
