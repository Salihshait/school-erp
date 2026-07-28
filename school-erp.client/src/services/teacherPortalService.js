import supabase from '../lib/supabaseClient'

// Teacher profile resolution (teacher auth is Supabase auth + email match against `teachers`)
export const getTeacherProfileByEmail = async (email) => {
  const { data, error } = await supabase.from('teachers').select('*').eq('email', email).maybeSingle()
  if (error) throw error
  return data
}
