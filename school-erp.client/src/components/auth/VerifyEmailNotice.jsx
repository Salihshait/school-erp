import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function VerifyEmailNotice() {
  const { resendVerificationEmail } = useAuth()
  const location = useLocation()
  const email = location.state?.email
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState(null)

  async function handleResend() {
    if (!email) return
    setStatus('sending')
    setMessage(null)
    try {
      await resendVerificationEmail(email)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || String(err))
    }
  }

  return (
    <div style={{ maxWidth: 420, padding: 16 }}>
      <h3>Verify your email</h3>
      <p>
        {email ? (
          <>We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.</>
        ) : (
          'Check your inbox for a confirmation link, then sign in.'
        )}
      </p>
      {email && (
        <button onClick={handleResend} disabled={status === 'sending'}>
          {status === 'sent' ? 'Email sent' : 'Resend email'}
        </button>
      )}
      {message && <p style={{ marginTop: 12, color: 'crimson' }}>{message}</p>}
      <p style={{ marginTop: 12 }}><Link to="/auth">Back to sign in</Link></p>
    </div>
  )
}
