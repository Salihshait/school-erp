import React, { createContext, useContext } from 'react'

const TeacherPortalContext = createContext(null)

export function TeacherPortalProvider({ teacher, children }) {
  const value = { teacher, teacherId: teacher?.id }
  return <TeacherPortalContext.Provider value={value}>{children}</TeacherPortalContext.Provider>
}

export function useTeacherPortalContext() {
  const ctx = useContext(TeacherPortalContext)
  if (!ctx) throw new Error('useTeacherPortalContext must be used within TeacherPortalProvider')
  return ctx
}
