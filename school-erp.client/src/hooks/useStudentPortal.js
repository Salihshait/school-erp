import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../components/auth/AuthProvider'
import * as studentPortalService from '../services/studentPortalService'

// Resolves the logged-in Supabase user to their `students` row by matching
// email. Login itself reuses the existing Supabase auth flow (/auth); this
// just scopes data access to the student's own records once logged in.
export function useStudentProfile() {
  const { user, loading: authLoading } = useAuth()
  const query = useQuery(
    ['student-portal', 'profile', user?.email],
    () => studentPortalService.getStudentProfileByEmail(user.email),
    { enabled: !!user?.email }
  )
  return { ...query, user, isLoading: authLoading || query.isLoading }
}

// Assignments
export function useAssignments(params) {
  return useQuery(['student-portal', 'assignments', params], () => studentPortalService.getAssignments(params))
}

export function useSubmissions(student_id) {
  return useQuery(['student-portal', 'submissions', student_id], () => studentPortalService.getSubmissions({ student_id }), { enabled: !!student_id })
}

export function useSubmitAssignment() {
  const qc = useQueryClient()
  return useMutation(studentPortalService.submitAssignment, { onSuccess: () => qc.invalidateQueries(['student-portal', 'submissions']) })
}

export function useCreateAssignment() {
  const qc = useQueryClient()
  return useMutation(studentPortalService.createAssignment, { onSuccess: () => qc.invalidateQueries(['student-portal', 'assignments']) })
}

export function useAssignmentSubmissions(assignment_id) {
  return useQuery(['student-portal', 'assignment-submissions', assignment_id], () => studentPortalService.getAssignmentSubmissions(assignment_id), { enabled: !!assignment_id })
}

export function useGradeSubmission() {
  const qc = useQueryClient()
  return useMutation(studentPortalService.gradeSubmission, { onSuccess: () => qc.invalidateQueries(['student-portal', 'assignment-submissions']) })
}

// Download Notes
export function useStudyNotes(params) {
  return useQuery(['student-portal', 'notes', params], () => studentPortalService.getStudyNotes(params))
}

// Certificates
export function useCertificates(student_id) {
  return useQuery(['student-portal', 'certificates', student_id], () => studentPortalService.getCertificates(student_id), { enabled: !!student_id })
}
