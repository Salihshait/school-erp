import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import faceEnrollmentService from '../services/faceEnrollmentService'
import fingerprintService from '../services/fingerprintService'

export function useFaceEnrollments(studentId) {
  return useQuery(['face-enrollments', studentId], () => faceEnrollmentService.listForStudent(studentId), { enabled: !!studentId })
}

export function useRosterFaceEnrollments(studentIds) {
  return useQuery(
    ['face-enrollments', 'roster', studentIds],
    () => faceEnrollmentService.listForRoster(studentIds),
    { enabled: !!studentIds?.length }
  )
}

export function useAddFaceEnrollment(studentId) {
  const qc = useQueryClient()
  return useMutation(
    (payload) => faceEnrollmentService.addEnrollment(studentId, payload),
    { onSuccess: () => qc.invalidateQueries(['face-enrollments', studentId]) }
  )
}

export function useRemoveFaceEnrollment(studentId) {
  const qc = useQueryClient()
  return useMutation(
    (id) => faceEnrollmentService.removeEnrollment(id),
    { onSuccess: () => qc.invalidateQueries(['face-enrollments', studentId]) }
  )
}

export function useBiometricDevices() {
  return useQuery(['biometric-devices'], fingerprintService.listDevices)
}

export function useAddBiometricDevice() {
  const qc = useQueryClient()
  return useMutation(fingerprintService.addDevice, { onSuccess: () => qc.invalidateQueries(['biometric-devices']) })
}

export function useUpdateBiometricDevice() {
  const qc = useQueryClient()
  return useMutation(
    ({ id, payload }) => fingerprintService.updateDevice(id, payload),
    { onSuccess: () => qc.invalidateQueries(['biometric-devices']) }
  )
}

export function useRemoveBiometricDevice() {
  const qc = useQueryClient()
  return useMutation(fingerprintService.removeDevice, { onSuccess: () => qc.invalidateQueries(['biometric-devices']) })
}
