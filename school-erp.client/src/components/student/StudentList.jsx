import React, { useState } from 'react'
import { useStudents, useDeleteStudent } from '../../hooks/useStudents'
import StudentFilters from './components/StudentFilters'

export default function StudentList() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const { data: students, isLoading } = useStudents({ page: 1, perPage: 50, search, filters })
  const deleteMut = useDeleteStudent()

  return (
    <div style={{ padding: 20 }}>
      <h2>Students</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search by name, admission no, email" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 8, width: 400 }} />
      </div>

      <StudentFilters onChange={setFilters} />

      <div style={{ marginTop: 16 }}>
        {isLoading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Admission #</th>
                <th>Class</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(students || []).map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid #eee' }}>
                  <td><img src={s.photo_url || '/placeholder.png'} alt="photo" style={{ width: 48, height: 48, borderRadius: '50%' }} /></td>
                  <td>{s.first_name} {s.last_name}</td>
                  <td>{s.admission_number}</td>
                  <td>{s.class_id || s.section}</td>
                  <td>{s.mobile}</td>
                  <td>
                    <a href={`/student/${s.id}`}>View</a> {' | '}
                    <a href={`/student/edit/${s.id}`}>Edit</a> {' | '}
                    <button className="btn-danger btn-sm" onClick={() => deleteMut.mutate(s.id)}>Delete</button>
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
