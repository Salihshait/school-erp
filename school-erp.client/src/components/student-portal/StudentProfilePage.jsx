import React from 'react'
import { useStudent } from '../../hooks/useStudents'
import { useStudentPortalContext } from './StudentPortalContext'
import PortalCard from '../common/PortalCard'

function Field({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text)' }}>{label}</span>
      <span>{value || '—'}</span>
    </div>
  )
}

export default function StudentProfilePage() {
  const { studentId } = useStudentPortalContext()
  const { data: s, isLoading } = useStudent(studentId)

  if (isLoading) return <div>Loading...</div>
  if (!s) return <div>Profile not found.</div>

  return (
    <div>
      <h2>Profile</h2>
      <PortalCard>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <img src={s.photo_url || '/placeholder.png'} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
          <div>
            <h3 style={{ margin: '0 0 4px' }}>{s.first_name} {s.last_name}</h3>
            <div style={{ color: 'var(--text)' }}>Admission #: {s.admission_number}</div>
          </div>
        </div>
        <Field label="Roll Number" value={s.roll_number} />
        <Field label="Class" value={s.class_id} />
        <Field label="Section" value={s.section} />
        <Field label="Date of Birth" value={s.dob} />
        <Field label="Mobile" value={s.mobile} />
        <Field label="Email" value={s.email} />
        <Field label="Address" value={s.address} />
      </PortalCard>
    </div>
  )
}
