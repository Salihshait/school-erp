// Fingerprint/biometric hardware integration.
//
// A browser has no way to talk to a USB/serial fingerprint scanner directly —
// that requires the vendor's own SDK running as local middleware (e.g. a
// small Windows service or desktop agent) that exposes some API of its own.
// The shape of that API (REST? WebSocket? polling vs push?) is entirely
// vendor-specific, so this module is a scaffold: it manages device *config*
// in Supabase, and defines the one call (`pollForMatch`) you'd adapt once you
// know the real device's contract. Until then, devices stay `enabled: false`
// and the UI shows them as configured-but-not-connected.
import { supabase } from '../lib/supabaseClient'

const DEVICES_TABLE = 'biometric_devices'
const ENROLLMENTS_TABLE = 'student_fingerprint_enrollments'

export const fingerprintService = {
  async listDevices() {
    const { data, error } = await supabase.from(DEVICES_TABLE).select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async addDevice({ name, api_endpoint, api_key, enabled = false }) {
    const { data, error } = await supabase.from(DEVICES_TABLE).insert([{ name, api_endpoint, api_key, enabled, device_type: 'fingerprint' }]).select().single()
    if (error) throw error
    return data
  },

  async updateDevice(id, payload) {
    const { data, error } = await supabase.from(DEVICES_TABLE).update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async removeDevice(id) {
    const { error } = await supabase.from(DEVICES_TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },

  async listEnrollmentsForStudent(studentId) {
    const { data, error } = await supabase.from(ENROLLMENTS_TABLE).select('*').eq('student_id', studentId)
    if (error) throw error
    return data
  },

  // Records the pairing between a student and the template ID the vendor's
  // own enrollment software assigned on the device. Enrollment itself still
  // has to happen in that vendor software — this just links the result to a
  // student record.
  async pairEnrollment({ studentId, deviceId, externalTemplateId }) {
    const { data, error } = await supabase.from(ENROLLMENTS_TABLE).insert([{
      student_id: studentId,
      device_id: deviceId,
      external_template_id: externalTemplateId,
    }]).select().single()
    if (error) throw error
    return data
  },

  // Placeholder contract: expects the device's local bridge to expose
  // GET <api_endpoint>/last-scan returning { external_template_id } for the
  // most recent scan, or 204 if nothing new. Adapt this once a real device's
  // API is known — until then this will just fail loudly, which is correct.
  async pollForMatch(device) {
    const res = await fetch(`${device.api_endpoint}/last-scan`, {
      headers: device.api_key ? { Authorization: `Bearer ${device.api_key}` } : undefined,
    })
    if (res.status === 204) return null
    if (!res.ok) throw new Error(`Device ${device.name} returned ${res.status}`)
    const { external_template_id } = await res.json()
    if (!external_template_id) return null

    const { data, error } = await supabase
      .from(ENROLLMENTS_TABLE)
      .select('student_id')
      .eq('device_id', device.id)
      .eq('external_template_id', external_template_id)
      .maybeSingle()
    if (error) throw error
    return data ? data.student_id : null
  },
}

export default fingerprintService
