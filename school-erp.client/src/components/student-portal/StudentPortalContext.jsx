import React, { createContext, useContext } from 'react'

const StudentPortalContext = createContext(null)

export function StudentPortalProvider({ student, children }) {
  const value = { student, studentId: student?.id }
  return <StudentPortalContext.Provider value={value}>{children}</StudentPortalContext.Provider>
}

export function useStudentPortalContext() {
  const ctx = useContext(StudentPortalContext)
  if (!ctx) throw new Error('useStudentPortalContext must be used within StudentPortalProvider')
  return ctx
}
