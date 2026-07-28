import { supabase } from '../lib/supabaseClient'

const TBL = 'teachers'
const DOC_TBL = 'teacher_documents'

export const teacherService = {
  async list({ page = 1, perPage = 50, search = '', filters = {} } = {}) {
    const from = (page - 1) * perPage
    let query = supabase.from(TBL).select('*').range(from, from + perPage - 1).order('created_at', { ascending: false })
    if (search) query = query.ilike('first_name', `%${search}%`).or(`last_name.ilike.%${search}%`).or(`employee_number.ilike.%${search}%`)
    Object.entries(filters).forEach(([k, v]) => { if (v != null && v !== '') query = query.eq(k, v) })
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async get(id) {
    const { data, error } = await supabase.from(TBL).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase.from(TBL).insert([payload]).select().single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase.from(TBL).update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from(TBL).delete().eq('id', id)
    if (error) throw error
    return true
  },

  async uploadDocument(teacherId, file, name) {
    const filePath = `documents/${teacherId}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('teacher-documents').upload(filePath, file, { upsert: true })
    if (upErr) throw upErr
    const { data } = supabase.storage.from('teacher-documents').getPublicUrl(filePath)
    const { error } = await supabase.from(DOC_TBL).insert([{ teacher_id: teacherId, name, storage_path: filePath, public_url: data.publicUrl }])
    if (error) throw error
    return data.publicUrl
  }
}

export default teacherService
