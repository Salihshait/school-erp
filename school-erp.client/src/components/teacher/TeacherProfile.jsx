import React from 'react'
import { useTeacher } from '../../hooks/useTeachers'
import Timetable from './components/Timetable'
import AttendanceTable from './components/AttendanceTable'
import PerformanceCard from './components/PerformanceCard'

export default function TeacherProfile({ id }) {
  const { data: t, isLoading } = useTeacher(id)
  if (isLoading) return <div>Loading...</div>
  if (!t) return <div>Not found</div>

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <img src={t.photo_url || '/placeholder.png'} alt="photo" style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8 }} />
        <div>
          <h2>{t.first_name} {t.last_name}</h2>
          <div>Employee #: {t.employee_number}</div>
          <div>Dept: {t.department_id} • Designation: {t.designation}</div>
          <div>Mobile: {t.mobile} • Email: {t.email}</div>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Timetable</h3>
        <Timetable teacherId={id} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <section>
          <h3>Attendance</h3>
          <AttendanceTable teacherId={id} />
        </section>

        <section>
          <h3>Performance</h3>
          <PerformanceCard teacherId={id} />
        </section>
      </div>
    </div>
  )
}
