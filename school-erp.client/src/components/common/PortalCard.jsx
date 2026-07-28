import React from 'react'

export default function PortalCard({ title, action, children }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          {title && <h4 style={{ margin: 0 }}>{title}</h4>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
