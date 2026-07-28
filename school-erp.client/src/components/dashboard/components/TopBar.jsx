import React from 'react'
import { useAuth } from '../../auth/AuthProvider'

export function TopBar({ title }) {
  const { user } = useAuth()

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? <div style={{ fontSize: 14 }}>Signed in as <strong>{user.email}</strong></div> : <a href="/auth">Sign in</a>}
      </div>
    </header>
  )
}
