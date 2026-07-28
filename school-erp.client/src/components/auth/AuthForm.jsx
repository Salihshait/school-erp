import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { resolveRole, ROLE_HOME_ROUTES } from '../../services/authService'

export default function AuthForm() {
  const { user, signIn, signUp, signInWithMagicLink, loading, setRememberMe } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'magic'
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMessage(null)
  }, [mode])

  useEffect(() => {
    if (!loading && user) {
      resolveRole(user.email).then(role => navigate(ROLE_HOME_ROUTES[role], { replace: true }))
    }
  }, [loading, user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    try {
      if (mode === 'login') {
        setRememberMe(remember)
        await signIn({ email, password })
        const role = await resolveRole(email)
        navigate(ROLE_HOME_ROUTES[role], { replace: true })
      } else if (mode === 'signup') {
        const result = await signUp({ email, password })
        if (!result.session) {
          navigate('/verify-email', { state: { email } })
        } else {
          const role = await resolveRole(email)
          navigate(ROLE_HOME_ROUTES[role], { replace: true })
        }
      } else if (mode === 'magic') {
        await signInWithMagicLink(email)
        setMessage('Magic link sent — check your email.')
      }
    } catch (err) {
      setMessage(err.message || String(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) return <div style={{ padding: 16 }}>Loading...</div>

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
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
          </div>
        )}

        {mode === 'login' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5 }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: 13.5 }}>Forgot password?</Link>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="submit" disabled={submitting}>
            {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send magic link'}
          </button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Have an account?'}
          </button>
          <button type="button" onClick={() => setMode(mode === 'magic' ? 'login' : 'magic')}>
            {mode === 'magic' ? 'Use password instead' : 'Use magic link'}
          </button>
        </div>
      </form>

      {message && <p style={{ marginTop: 12, color: 'crimson' }}>{message}</p>}
    </div>
  )
}
