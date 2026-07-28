import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from './AuthProvider'

export default function AuthForm() {
  const { user, signIn, signUp, signOut, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'magic'
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setMessage(null)
  }, [mode])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    try {
      if (mode === 'login') {
        const { error } = await signIn({ email, password })
        if (error) setMessage(error.message)
      } else if (mode === 'signup') {
        const { error } = await signUp({ email, password })
        if (error) setMessage(error.message)
        else setMessage('Signup successful — check email to confirm (if enabled)')
      } else if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email })
        if (error) setMessage(error.message)
        else setMessage('Magic link sent to your email')
      }
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <div>Loading auth...</div>

  if (user) {
    return (
      <div style={{ padding: 16 }}>
        <p>Signed in as <strong>{user.email}</strong></p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, padding: 16 }}>
      <h3>{mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Sign up' : 'Sign in (magic link)'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>

        {mode !== 'magic' && (
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required={mode !== 'magic'} style={{ width: '100%' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send magic link'}</button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create account' : 'Have an account?'}</button>
          <button type="button" onClick={() => setMode('magic')}>Use magic link</button>
        </div>
      </form>

      {message && <p style={{ marginTop: 12, color: 'crimson' }}>{message}</p>}
    </div>
  )
}
