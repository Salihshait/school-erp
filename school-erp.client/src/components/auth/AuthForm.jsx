import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { resolveRole, ROLE_HOME_ROUTES } from '../../services/authService'
import './AuthForm.css'

const TITLES = {
  login: 'Sign in',
  signup: 'Create your account',
  magic: 'Sign in with a magic link',
}

const SUBTITLES = {
  login: 'Welcome back — enter your details to continue.',
  signup: 'Set up a new account to access the portal.',
  magic: "We'll email you a one-time link — no password needed.",
}

export default function AuthForm() {
  const { user, signIn, signUp, signInWithMagicLink, loading, setRememberMe } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'magic'
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')
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
        setMessageType('info')
        setMessage('Magic link sent — check your email.')
      }
    } catch (err) {
      setMessageType('error')
      setMessage(err.message || String(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) return <div className="auth-loading">Loading...</div>

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">S</span>
          <span className="auth-brand-name">School ERP</span>
        </div>

        <h1 className="auth-title">{TITLES[mode]}</h1>
        <p className="auth-subtitle">{SUBTITLES[mode]}</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {mode !== 'magic' && (
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="auth-row">
              <label className="auth-remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send magic link'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-toggle-row">
          <button type="button" className="btn-ghost btn-sm" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Have an account? Sign in'}
          </button>
          <span>·</span>
          <button type="button" className="btn-ghost btn-sm" onClick={() => setMode(mode === 'magic' ? 'login' : 'magic')}>
            {mode === 'magic' ? 'Use password instead' : 'Use magic link'}
          </button>
        </div>

        {message && <p className={`auth-message${messageType === 'info' ? ' info' : ''}`}>{message}</p>}
      </div>
    </div>
  )
}
