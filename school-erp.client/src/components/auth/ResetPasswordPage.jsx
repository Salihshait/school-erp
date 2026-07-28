import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function ResetPasswordPage() {
  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(password)
      navigate('/auth', { replace: true })
    } catch (err) {
      setMessage(err.message || String(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>

  if (!user) {
    return (
      <div style={{ maxWidth: 420, padding: 16 }}>
        <h3>Reset link invalid or expired</h3>
        <p style={{ fontSize: 13.5, color: 'var(--text)' }}>Please request a new password reset link.</p>
        <Link to="/forgot-password">Request a new link</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, padding: 16 }}>
      <h3>Set a new password</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>New password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>Confirm password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={submitting}>Update password</button>
      </form>
      {message && <p style={{ marginTop: 12, color: 'crimson' }}>{message}</p>}
    </div>
  )
}
