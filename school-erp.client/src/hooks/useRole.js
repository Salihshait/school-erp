import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../components/auth/AuthProvider'
import { resolveRole } from '../services/authService'

// Resolves which portal the signed-in user belongs to, for post-login
// redirect UX only (not an authorization check — see authService.resolveRole).
export function useRole() {
  const { user } = useAuth()
  return useQuery(['auth', 'role', user?.email], () => resolveRole(user.email), { enabled: !!user?.email })
}
