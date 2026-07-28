import { createClient } from '@supabase/supabase-js'

// Uses Vite env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

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
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: async () => notConfigured,
      signUp: async () => notConfigured,
      signInWithOtp: async () => notConfigured,
      signOut: async () => ({ error: null }),
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
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackClient()

export default supabase
