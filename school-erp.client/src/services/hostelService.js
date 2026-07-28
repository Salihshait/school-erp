import supabase from '../lib/supabaseClient'

// Hostel Blocks
export const getBlocks = async () => {
  const { data, error } = await supabase.from('hostel_blocks').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export const createBlock = async (payload) => {
  const { data, error } = await supabase.from('hostel_blocks').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const updateBlock = async (id, payload) => {
  const { data, error } = await supabase.from('hostel_blocks').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteBlock = async (id) => {
  const { error } = await supabase.from('hostel_blocks').delete().eq('id', id)
  if (error) throw error
  return true
}

// Rooms
export const getRooms = async ({ block_id } = {}) => {
  let q = supabase.from('rooms').select('*').order('room_number', { ascending: true })
  if (block_id) q = q.eq('block_id', block_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createRoom = async (payload) => {
  const { data, error } = await supabase.from('rooms').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const updateRoom = async (id, payload) => {
  const { data, error } = await supabase.from('rooms').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteRoom = async (id) => {
  const { error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) throw error
  return true
}

// Beds
export const getBeds = async ({ room_id } = {}) => {
  let q = supabase.from('beds').select('*').order('bed_number', { ascending: true })
  if (room_id) q = q.eq('room_id', room_id)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createBed = async (payload) => {
  const { data, error } = await supabase.from('beds').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const updateBedStatus = async (id, status) => {
  const { data, error } = await supabase.from('beds').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Room Allocation
export const getAllocations = async ({ status } = {}) => {
  let q = supabase.from('room_allocations').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const allocateRoom = async ({ bed_id, student_id, notes }) => {
  const { data, error } = await supabase.from('room_allocations')
    .insert([{ bed_id, student_id, notes, allocated_date: new Date().toISOString().slice(0, 10) }])
    .select().single()
  if (error) throw error
  await updateBedStatus(bed_id, 'occupied')
  return data
}

export const vacateAllocation = async (id, bed_id) => {
  const { data, error } = await supabase.from('room_allocations')
    .update({ status: 'vacated', vacated_date: new Date().toISOString().slice(0, 10) })
    .eq('id', id).select().single()
  if (error) throw error
  if (bed_id) await updateBedStatus(bed_id, 'vacant')
  return data
}

// Mess Management
export const getMessMenu = async () => {
  const { data, error } = await supabase.from('mess_menu').select('*').order('day_of_week', { ascending: true })
  if (error) throw error
  return data
}

export const upsertMessMenu = async (payload) => {
  const { data, error } = await supabase.from('mess_menu')
    .upsert([payload], { onConflict: 'day_of_week,meal_type' }).select().single()
  if (error) throw error
  return data
}

export const recordMessAttendance = async (payload) => {
  const { data, error } = await supabase.from('mess_attendance').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getMessAttendance = async ({ meal_date } = {}) => {
  let q = supabase.from('mess_attendance').select('*').order('meal_date', { ascending: false })
  if (meal_date) q = q.eq('meal_date', meal_date)
  const { data, error } = await q
  if (error) throw error
  return data
}

// Visitors
export const getVisitors = async () => {
  const { data, error } = await supabase.from('visitors').select('*').order('check_in', { ascending: false })
  if (error) throw error
  return data
}

export const logVisitorCheckIn = async (payload) => {
  const { data, error } = await supabase.from('visitors').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const logVisitorCheckOut = async (id) => {
  const { data, error } = await supabase.from('visitors')
    .update({ check_out: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Hostel Attendance
export const getHostelAttendance = async ({ attendance_date } = {}) => {
  let q = supabase.from('hostel_attendance').select('*').order('attendance_date', { ascending: false })
  if (attendance_date) q = q.eq('attendance_date', attendance_date)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const markHostelAttendance = async (payload) => {
  const { data, error } = await supabase.from('hostel_attendance')
    .upsert([payload], { onConflict: 'student_id,attendance_date' }).select().single()
  if (error) throw error
  return data
}

// Hostel Fees
export const getHostelFees = async ({ status } = {}) => {
  let q = supabase.from('hostel_fees').select('*').order('due_date', { ascending: true })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const createHostelFee = async (payload) => {
  const { data, error } = await supabase.from('hostel_fees').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const collectHostelFee = async (id) => {
  const { data, error } = await supabase.from('hostel_fees')
    .update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const getHostelFeeSummary = async () => {
  const { data, error } = await supabase.from('hostel_fee_summary').select('*')
  if (error) throw error
  return data
}

// Complaints
export const getComplaints = async ({ status } = {}) => {
  let q = supabase.from('complaints').select('*').order('raised_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return data
}

export const raiseComplaint = async (payload) => {
  const { data, error } = await supabase.from('complaints').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const updateComplaintStatus = async (id, status) => {
  const payload = { status }
  if (status === 'resolved') payload.resolved_at = new Date().toISOString()
  const { data, error } = await supabase.from('complaints').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Reports / Dashboard
export const getRoomOccupancy = async () => {
  const { data, error } = await supabase.from('room_occupancy').select('*')
  if (error) throw error
  return data
}
