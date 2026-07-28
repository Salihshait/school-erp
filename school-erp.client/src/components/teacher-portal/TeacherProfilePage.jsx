import React from 'react'
import { useTeacher } from '../../hooks/useTeachers'
import { useTeacherPortalContext } from './TeacherPortalContext'
import PortalCard from '../common/PortalCard'

function Field({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text)' }}>{label}</span>
      <span>{value || '—'}</span>
    </div>
  )
}

export default function TeacherProfilePage() {
  const { teacherId } = useTeacherPortalContext()
  const { data: t, isLoading } = useTeacher(teacherId)

  if (isLoading) return <div>Loading...</div>
  if (!t) return <div>Profile not found.</div>

  return (
    <div>
      <h2>Profile</h2>
      <PortalCard>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <img src={t.photo_url || '/placeholder.png'} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
          <div>
            <h3 style={{ margin: '0 0 4px' }}>{t.first_name} {t.last_name}</h3>
            <div style={{ color: 'var(--text)' }}>Employee #: {t.employee_number}</div>
          </div>
        </div>
        <Field label="Designation" value={t.designation} />
        <Field label="Employment Type" value={t.employment_type} />
        <Field label="Mobile" value={t.mobile} />
        <Field label="Email" value={t.email} />
        <Field label="Address" value={t.address} />
      </PortalCard>
    </div>
  )
}
