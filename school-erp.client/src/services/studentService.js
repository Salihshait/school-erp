import { supabase } from '../lib/supabaseClient'

const STUDENT_TABLE = 'students'
const DOC_TABLE = 'student_documents'

export const studentService = {
  async list({ page = 1, perPage = 20, search = '', filters = {} } = {}) {
    const from = (page - 1) * perPage
    let query = supabase.from(STUDENT_TABLE).select('*').range(from, from + perPage - 1).order('created_at', { ascending: false })
    if (search) query = query.textSearch('full_text', search)
    // Apply basic filters
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') query = query.eq(k, v)
    })
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase.from(STUDENT_TABLE).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase.from(STUDENT_TABLE).insert([payload]).select().single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase.from(STUDENT_TABLE).update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from(STUDENT_TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },

  async uploadPhoto(studentId, file) {
    // store in bucket 'student-photos' under studentId/filename
    const filePath = `${studentId}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('student-photos').upload(filePath, file, { upsert: true })
    if (upErr) throw upErr
    const { data } = supabase.storage.from('student-photos').getPublicUrl(filePath)
    // update student record
    await supabase.from(STUDENT_TABLE).update({ photo_url: data.publicUrl }).eq('id', studentId)
    return data.publicUrl
  },

  async uploadDocument(studentId, file, name) {
    const filePath = `documents/${studentId}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('student-documents').upload(filePath, file, { upsert: true })
    if (upErr) throw upErr
    const { data } = supabase.storage.from('student-documents').getPublicUrl(filePath)
    const { error } = await supabase.from(DOC_TABLE).insert([{ student_id: studentId, name, storage_path: filePath, public_url: data.publicUrl }])
    if (error) throw error
    return data.publicUrl
  }
}

export default studentService
