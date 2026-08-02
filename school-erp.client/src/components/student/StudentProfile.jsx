import React from 'react'
import { useStudent } from '../../hooks/useStudents'
import FaceEnrollment from './FaceEnrollment'

export default function StudentProfile({ id }) {
  const { data: s, isLoading } = useStudent(id)
  if (isLoading) return <div>Loading...</div>
  if (!s) return <div>Not found</div>

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <img src={s.photo_url || '/placeholder.png'} alt="photo" style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8 }} />
        <div>
          <h2>{s.first_name} {s.last_name}</h2>
          <div>Admission #: {s.admission_number}</div>
          <div>Roll #: {s.roll_number}</div>
          <div>Class: {s.class_id} • Section: {s.section}</div>
          <div>Mobile: {s.mobile} • Email: {s.email}</div>
          <div>DOB: {s.dob}</div>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Parents</h3>
        {/* placeholder - parents listing can be added via API */}
        <div>No parents data</div>
      </section>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => window.print()}>Print Profile</button>
        <button style={{ marginLeft: 8 }}>Generate ID Card</button>
      </div>

      <FaceEnrollment studentId={id} />
    </div>
  )
}
