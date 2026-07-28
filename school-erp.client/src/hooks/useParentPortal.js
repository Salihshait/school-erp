import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../components/auth/AuthProvider'
import * as parentPortalService from '../services/parentPortalService'

// Resolves the logged-in Supabase user to their `parents` row (+ linked student)
// by matching email. This is the "authentication" bridge for the parent portal:
// login itself reuses the existing Supabase auth flow, this just scopes data
// access to the parent's own child once logged in.
export function useParentProfile() {
  const { user, loading: authLoading } = useAuth()
  const query = useQuery(
    ['parent-portal', 'profile', user?.email],
    () => parentPortalService.getParentProfileByEmail(user.email),
    { enabled: !!user?.email }
  )
  return { ...query, user, isLoading: authLoading || query.isLoading }
}

// Homework
export function useHomework(params) {
  return useQuery(['parent-portal', 'homework', params], () => parentPortalService.getHomework(params))
}

// Notice Board
export function useNotices() {
  return useQuery(['parent-portal', 'notices'], parentPortalService.getNotices)
}

// School Events
export function useEvents() {
  return useQuery(['parent-portal', 'events'], parentPortalService.getEvents)
}

// Teacher Chat
export function useMessages(params) {
  return useQuery(['parent-portal', 'messages', params], () => parentPortalService.getMessages(params), {
    enabled: !!params?.student_id && !!params?.teacher_id,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation(parentPortalService.sendMessage, {
    onSuccess: (_data, variables) => qc.invalidateQueries(['parent-portal', 'messages', { student_id: variables.student_id, teacher_id: variables.teacher_id }]),
  })
}

// Notifications
export function useNotifications(params) {
  return useQuery(['parent-portal', 'notifications', params], () => parentPortalService.getNotifications(params), {
    enabled: !!params?.parent_id,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation(parentPortalService.markNotificationRead, { onSuccess: () => qc.invalidateQueries(['parent-portal', 'notifications']) })
}
