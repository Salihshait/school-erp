import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setMessage(null)
    try {
      await requestPasswordReset(email)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || String(err))
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ maxWidth: 420, padding: 16 }}>
        <h3>Check your email</h3>
        <p>If an account exists for <strong>{email}</strong>, a password reset link has been sent.</p>
        <Link to="/auth">Back to sign in</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, padding: 16 }}>
      <h3>Forgot password</h3>
      <p style={{ fontSize: 13.5, color: 'var(--text)' }}>Enter your email and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={status === 'sending'}>Send reset link</button>
      </form>
      {message && <p style={{ marginTop: 12, color: 'crimson' }}>{message}</p>}
      <p style={{ marginTop: 12 }}><Link to="/auth">Back to sign in</Link></p>
    </div>
  )
}
