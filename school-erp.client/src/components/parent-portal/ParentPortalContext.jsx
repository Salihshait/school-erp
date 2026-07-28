import React, { createContext, useContext } from 'react'

const ParentPortalContext = createContext(null)

export function ParentPortalProvider({ parent, children }) {
  const value = {
    parent,
    student: parent?.students || null,
    studentId: parent?.student_id,
    parentId: parent?.id,
  }
  return <ParentPortalContext.Provider value={value}>{children}</ParentPortalContext.Provider>
}

export function useParentPortalContext() {
  const ctx = useContext(ParentPortalContext)
  if (!ctx) throw new Error('useParentPortalContext must be used within ParentPortalProvider')
  return ctx
}
