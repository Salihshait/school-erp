import supabase, { REMEMBER_ME_KEY } from '../lib/supabaseClient'

// Remember Me
export function setRememberMe(remember) {
  window.localStorage.setItem(REMEMBER_ME_KEY, remember ? 'true' : 'false')
}

// Session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange(callback)
  return data.subscription
}

// Login / Logout
export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signInWithMagicLink = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({ email })
  if (error) throw error
  return data
}

export const signUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Forgot / Reset Password
export const requestPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data
}

// Email Verification
export const resendVerificationEmail = async (email) => {
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) throw error
}

// Role Based Login: resolves which portal an email belongs to, purely for
// post-login redirect UX. This is NOT an authorization check — each portal
// independently verifies the logged-in user's email against its own table
// before showing any data.
export const resolveRole = async (email) => {
  const [teacher, parent, student] = await Promise.all([
    supabase.from('teachers').select('id').eq('email', email).maybeSingle(),
    supabase.from('parents').select('id').eq('email', email).maybeSingle(),
    supabase.from('students').select('id').eq('email', email).maybeSingle(),
  ])
  if (teacher.data) return 'teacher'
  if (parent.data) return 'parent'
  if (student.data) return 'student'
  return 'admin'
}

export const ROLE_HOME_ROUTES = {
  teacher: '/teacher-portal',
  parent: '/parent',
  student: '/student-portal',
  admin: '/',
}
