import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../components/auth/AuthProvider'
import * as teacherPortalService from '../services/teacherPortalService'

// Resolves the logged-in Supabase user to their `teachers` row by matching
// email. Login itself reuses the existing Supabase auth flow (/auth); this
// just scopes data access to the teacher's own records once logged in.
export function useTeacherProfile() {
  const { user, loading: authLoading } = useAuth()
  const query = useQuery(
    ['teacher-portal', 'profile', user?.email],
    () => teacherPortalService.getTeacherProfileByEmail(user.email),
    { enabled: !!user?.email }
  )
  return { ...query, user, isLoading: authLoading || query.isLoading }
}
