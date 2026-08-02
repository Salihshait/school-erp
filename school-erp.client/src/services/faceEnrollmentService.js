import { supabase } from '../lib/supabaseClient'
import { descriptorToArray, descriptorFromArray } from './faceRecognitionService'

const TABLE = 'student_face_enrollments'
const BUCKET = 'student-face-enrollments'

export const faceEnrollmentService = {
  async listForStudent(studentId) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('student_id', studentId).order('captured_at', { ascending: false })
    if (error) throw error
    return data
  },

  // roster: array of student ids. Returns [{ studentId, descriptor }], flattened
  // across every captured angle, ready for faceRecognitionService.findBestMatch.
  async listForRoster(studentIds = []) {
    if (!studentIds.length) return []
    const { data, error } = await supabase.from(TABLE).select('student_id, descriptor').in('student_id', studentIds)
    if (error) throw error
    return (data || []).map(row => ({ studentId: row.student_id, descriptor: descriptorFromArray(row.descriptor) }))
  },

  async addEnrollment(studentId, { descriptor, imageBlob, label }) {
    let image_path = null
    if (imageBlob) {
      const filePath = `${studentId}/${Date.now()}.jpg`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(filePath, imageBlob, { upsert: true, contentType: 'image/jpeg' })
      if (upErr) throw upErr
      image_path = filePath
    }
    const { data, error } = await supabase.from(TABLE).insert([{
      student_id: studentId,
      descriptor: descriptorToArray(descriptor),
      image_path,
      label,
    }]).select().single()
    if (error) throw error
    return data
  },

  async removeEnrollment(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },

  getImageUrl(image_path) {
    if (!image_path) return null
    return supabase.storage.from(BUCKET).getPublicUrl(image_path).data.publicUrl
  },
}

export default faceEnrollmentService
