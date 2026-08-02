import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateStudent, useUpdateStudent, useStudent } from '../../hooks/useStudents'
import AvatarUpload from './components/AvatarUpload'
import '../common/FormCard.css'

const schema = yup.object({
  admission_number: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email().nullable(),
  mobile: yup.string().nullable(),
  dob: yup.date().nullable(),
})

export default function StudentForm({ id }) {
  const { data } = useStudent(id)
  const create = useCreateStudent()
  const update = useUpdateStudent()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => { if (data) reset(data) }, [data])

  async function onSubmit(vals) {
    try {
      if (id) await update.mutateAsync({ id, payload: vals })
      else await create.mutateAsync(vals)
      alert('Saved')
    } catch (err) { alert(err.message || 'Save failed') }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{id ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-card">
        <div className="form-section">
          <h3 className="form-section-title">Photo</h3>
          <AvatarUpload studentId={id} />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Identification</h3>
          <div className="form-grid">
            <div className="field">
              <label>Admission Number</label>
              <input {...register('admission_number')} />
              {errors.admission_number && <div className="field-error">{errors.admission_number.message}</div>}
            </div>
            <div className="field">
              <label>Roll Number</label>
              <input {...register('roll_number')} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Personal Details</h3>
          <div className="form-grid">
            <div className="field">
              <label>First Name</label>
              <input {...register('first_name')} />
              {errors.first_name && <div className="field-error">{errors.first_name.message}</div>}
            </div>
            <div className="field">
              <label>Last Name</label>
              <input {...register('last_name')} />
              {errors.last_name && <div className="field-error">{errors.last_name.message}</div>}
            </div>
            <div className="field">
              <label>Date of Birth</label>
              <input type="date" {...register('dob')} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Contact</h3>
          <div className="form-grid">
            <div className="field">
              <label>Email</label>
              <input type="email" {...register('email')} />
              {errors.email && <div className="field-error">{errors.email.message}</div>}
            </div>
            <div className="field">
              <label>Mobile</label>
              <input {...register('mobile')} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
