import { createClient } from '@supabase/supabase-js'

// Uses Vite env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const REMEMBER_ME_KEY = 'school-erp:remember-me'

// "Remember me" support: Supabase's storage adapter must be picked at client
// creation time, so instead of swapping clients we use one adapter that reads
// a flag (set at login) to decide, per call, whether the session lives in
// localStorage (persists across browser restarts) or sessionStorage (cleared
// when the tab closes). Defaults to remembering, matching most apps' UX.
function rememberMeEnabled() {
  try {
    return window.localStorage.getItem(REMEMBER_ME_KEY) !== 'false'
  } catch {
    return true
  }
}

const rememberAwareStorage = {
  getItem: (key) => (rememberMeEnabled() ? window.localStorage : window.sessionStorage).getItem(key),
  setItem: (key, value) => (rememberMeEnabled() ? window.localStorage : window.sessionStorage).setItem(key, value),
  removeItem: (key) => {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

// Falls back to a no-op client when env vars aren't configured, so the app
// still renders (signed-out) instead of crashing at import time.
function createFallbackClient() {
  const noSession = { data: { session: null }, error: null }
  const notConfigured = { data: null, error: new Error('Supabase is not configured') }
  const queryStub = {
    select() { return this },
    range() { return this },
    order() { return this },
    eq() { return this },
    textSearch() { return this },
    maybeSingle: async () => notConfigured,
    single: async () => notConfigured,
    then(resolve) { return resolve(notConfigured) },
  }
  return {
    auth: {
      getSession: async () => noSession,
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => notConfigured,
      signUp: async () => notConfigured,
      signInWithOtp: async () => notConfigured,
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => notConfigured,
      updateUser: async () => notConfigured,
      resend: async () => notConfigured,
    },
    from() { return queryStub },
    storage: {
      from() {
        return {
          upload: async () => notConfigured,
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }
      },
    },
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { storage: rememberAwareStorage } })
  : createFallbackClient()

export default supabase
