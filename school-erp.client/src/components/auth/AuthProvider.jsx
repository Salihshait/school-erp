import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    authService.getSession().then(s => {
      if (!mounted) return
      setSession(s)
      setLoading(false)
    })

    const subscription = authService.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user: session?.user || null,
    session,
    loading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
    signInWithMagicLink: authService.signInWithMagicLink,
    requestPasswordReset: authService.requestPasswordReset,
    updatePassword: authService.updatePassword,
    resendVerificationEmail: authService.resendVerificationEmail,
    setRememberMe: authService.setRememberMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
