import supabase from '../lib/supabaseClient'

export const createRoute = async (payload) => {
  const { data, error } = await supabase.from('routes').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getRoutes = async () => {
  const { data, error } = await supabase.from('routes').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addVehicle = async (payload) => {
  const { data, error } = await supabase.from('vehicles').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getVehicles = async () => {
  const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addDriver = async (payload) => {
  const { data, error } = await supabase.from('drivers').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getDrivers = async () => {
  const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const allocateVehicle = async (payload) => {
  const { data, error } = await supabase.from('allocations').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const recordMaintenance = async (payload) => {
  const { data, error } = await supabase.from('maintenance').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const addFuelExpense = async (payload) => {
  const { data, error } = await supabase.from('fuel_expenses').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const getVehicleUtilization = async () => {
  const { data, error } = await supabase.from('vehicle_utilization').select('*')
  if (error) throw error
  return data
}
