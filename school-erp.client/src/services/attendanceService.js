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

export const getHolidays = async () => {
  const { data, error } = await supabase.from('attendance_holidays').select('*').order('holiday_date', { ascending: true })
  if (error) throw error
  return data
}

export const exportAttendanceCsv = async (query) => {
  // lightweight: fetch records and return CSV rows (caller handles saving)
  const { data, error } = await supabase.from('attendance_records').select('*').limit(10000)
  if (error) throw error
  return data
}
