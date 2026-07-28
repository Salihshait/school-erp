import React, { useState } from 'react'
import { useTeachers, useDeleteTeacher } from '../../hooks/useTeachers'
import TeacherFilters from './components/TeacherFilters'

export default function TeacherList() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const { data: teachers, isLoading } = useTeachers({ page: 1, perPage: 100, search, filters })
  const del = useDeleteTeacher()

  return (
    <div style={{ padding: 20 }}>
      <h2>Teachers</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search by name or employee no" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 8, width: 360 }} />
        <a href="/teacher/new" style={{ marginLeft: 12 }}>Add Teacher</a>
      </div>
      <TeacherFilters onChange={setFilters} />

      <div style={{ marginTop: 16 }}>
        {isLoading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Employee #</th>
                <th>Dept</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(teachers || []).map(t => (
                <tr key={t.id} style={{ borderTop: '1px solid #eee' }}>
                  <td><img src={t.photo_url || '/placeholder.png'} alt="photo" style={{ width: 48, height: 48, borderRadius: '50%' }} /></td>
                  <td>{t.first_name} {t.last_name}</td>
                  <td>{t.employee_number}</td>
                  <td>{t.department_id}</td>
                  <td>{t.mobile}</td>
                  <td>
                    <a href={`/teacher/${t.id}`}>View</a> {' | '}
                    <a href={`/teacher/edit/${t.id}`}>Edit</a> {' | '}
                    <button onClick={() => del.mutate(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
